const modelsEndpoint = "https://api.zeroeval.com/v1/models";
const metricsEndpoint = "https://api.zeroeval.com/v1/models/metrics";
const sourceUrl = "https://llm-stats.com/";

type SourceModel = {
  id: string;
  display_name: string;
  organization_name: string;
  context_length: number | null;
  input_price: number | null;
  output_price: number | null;
};

type SourceMetric = {
  model_id: string;
  total_calls: number;
  avg_throughput: number | null;
  avg_latency: number | null;
};

type RankingEntry = { model: string; provider: string; value: string };

function rank<T>(items: T[], score: (item: T) => number, direction: "asc" | "desc", format: (item: T) => RankingEntry) {
  return [...items]
    .sort((left, right) => direction === "asc" ? score(left) - score(right) : score(right) - score(left))
    .slice(0, 3)
    .map(format);
}

export async function GET() {
  try {
    const upstreamOptions = { cf: { cacheEverything: true, cacheTtl: 900 } } as RequestInit;
    const [modelsResponse, metricsResponse] = await Promise.all([
      fetch(modelsEndpoint, upstreamOptions),
      fetch(metricsEndpoint, upstreamOptions),
    ]);
    if (!modelsResponse.ok || !metricsResponse.ok) throw new Error("Model source unavailable");

    const [models, metrics] = await Promise.all([
      modelsResponse.json() as Promise<SourceModel[]>,
      metricsResponse.json() as Promise<SourceMetric[]>,
    ]);
    const modelById = new Map(models.map((model) => [model.id, model]));
    const measurable = metrics
      .filter((metric) => modelById.has(metric.model_id) && metric.total_calls >= 5)
      .map((metric) => ({ metric, model: modelById.get(metric.model_id)! }));

    const named = ({ model }: { model: SourceModel }, value: string): RankingEntry => ({
      model: model.display_name,
      provider: model.organization_name,
      value,
    });
    const priceable = models.filter((model) => model.input_price !== null && model.output_price !== null && model.input_price >= 0 && model.output_price >= 0);
    const contextual = models.filter((model) => model.context_length && model.context_length > 0);

    return Response.json({
      sourceUrl,
      updatedAt: new Date().toISOString(),
      rankings: [
        {
          id: "output-speed",
          title: "Fastest output",
          unit: "tokens per second",
          entries: rank(measurable.filter(({ metric }) => (metric.avg_throughput ?? 0) > 0), ({ metric }) => metric.avg_throughput!, "desc", ({ model, metric }) => named({ model, metric }, `${Math.round(metric.avg_throughput!)} tok/s`)),
        },
        {
          id: "latency",
          title: "Lowest latency",
          unit: "average time to first response",
          entries: rank(measurable.filter(({ metric }) => (metric.avg_latency ?? 0) > 0), ({ metric }) => metric.avg_latency!, "asc", ({ model, metric }) => named({ model, metric }, `${(metric.avg_latency! / 1000).toFixed(1)}s`)),
        },
        {
          id: "listed-price",
          title: "Lowest listed price",
          unit: "input plus output per million tokens",
          entries: rank(priceable, (model) => model.input_price! + model.output_price!, "asc", (model) => named({ model }, `$${(model.input_price! + model.output_price!).toFixed(2)} / M`)),
        },
        {
          id: "context",
          title: "Largest context",
          unit: "maximum input capacity",
          entries: rank(contextual, (model) => model.context_length!, "desc", (model) => named({ model }, `${formatTokens(model.context_length!)} tokens`)),
        },
      ],
    }, { headers: { "cache-control": "public, max-age=900, stale-while-revalidate=3600" } });
  } catch (error) {
    console.error("Live model rankings unavailable", error);
    return Response.json({ error: "Live model rankings are temporarily unavailable." }, { status: 503, headers: { "cache-control": "public, max-age=60" } });
  }
}

function formatTokens(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  return `${Math.round(value / 1_000)}K`;
}
