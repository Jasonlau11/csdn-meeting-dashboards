import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MousePointerClick,
  Target,
  UserCheck,
  Download,
  Share2,
  Calendar,
  Sparkles,
} from "lucide-react";

// —————— Mock data ——————
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 9301;
  return x - Math.floor(x);
}

type DataMode = "total" | "paid";

const MODE_META = {
  total: {
    label: "总数据",
    description: "展示自然流量、站内推荐、分享传播与付费推广汇总后的整体表现",
    badge: "全渠道",
    insight: "报名转化率高于行业基准（12.5%），建议继续扩大优质内容分发，同时观察付费渠道的边际成本。",
  },
  paid: {
    label: "推广数据",
    description: "仅展示由付费投放、资源位、合作媒体等推广动作带来的增量数据",
    badge: "付费推广",
    insight: "推广流量点击率较高，但报名转化更依赖落地页与票种权益表达，建议优先保留高意向行业人群定向。",
  },
} as const;

function buildTrend(days: number, mode: DataMode) {
  const baseDate = new Date(2026, 6, 5); // fixed anchor date 2026-07-05
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - (days - 1 - i));
    const base = 800 + Math.sin(i / 2) * 220 + i * 35;
    const totalClicks = Math.max(120, Math.round(base + (seededRandom(i) - 0.5) * 180));
    const totalSignups = Math.max(20, Math.round(totalClicks * (0.18 + seededRandom(i + 1000) * 0.08)));
    const paidRatio = 0.34 + seededRandom(i + 2000) * 0.08;
    const paidClicks = Math.round(totalClicks * paidRatio);
    const paidSignups = Math.round(paidClicks * (0.15 + seededRandom(i + 3000) * 0.05));
    return {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      clicks: mode === "paid" ? paidClicks : totalClicks,
      signups: mode === "paid" ? paidSignups : totalSignups,
    };
  });
}

const CHANNELS_BY_MODE: Record<DataMode, { name: string; value: number; color: string }[]> = {
  total: [
    { name: "微信社群", value: 4280, color: "var(--chart-1)" },
    { name: "公众号推文", value: 3120, color: "var(--chart-2)" },
    { name: "朋友圈分享", value: 2150, color: "var(--chart-3)" },
    { name: "合作媒体", value: 1340, color: "var(--chart-4)" },
    { name: "站内推荐", value: 860, color: "var(--chart-5)" },
  ],
  paid: [
    { name: "信息流广告", value: 1860, color: "var(--chart-1)" },
    { name: "CSDN 资源位", value: 1420, color: "var(--chart-2)" },
    { name: "合作媒体投放", value: 980, color: "var(--chart-3)" },
    { name: "定向社群投放", value: 720, color: "var(--chart-4)" },
    { name: "搜索关键词", value: 430, color: "var(--chart-5)" },
  ],
};

const SURVEY = {
  industry: [
    { label: "互联网 / 软件", value: 38 },
    { label: "金融 / 投资", value: 22 },
    { label: "教育 / 培训", value: 14 },
    { label: "制造 / 供应链", value: 11 },
    { label: "医疗 / 生物", value: 9 },
    { label: "其他", value: 6 },
  ],
  role: [
    { label: "高管 / 创始人", value: 28 },
    { label: "总监 / 经理", value: 41 },
    { label: "一线执行", value: 24 },
    { label: "学生 / 研究", value: 7 },
  ],
  city: [
    { label: "北京", value: 26 },
    { label: "上海", value: 23 },
    { label: "深圳", value: 18 },
    { label: "杭州", value: 12 },
    { label: "广州", value: 9 },
    { label: "其他城市", value: 12 },
  ],
  intent: [
    { label: "希望线下到场", value: 62 },
    { label: "仅线上参与", value: 28 },
    { label: "待定", value: 10 },
  ],
  topics: [
    { label: "Agent 落地案例", value: 72 },
    { label: "企业知识库", value: 58 },
    { label: "AI 编程", value: 49 },
    { label: "数字人 / 多模态", value: 34 },
    { label: "私有化部署", value: 29 },
  ],
  textClusters: [
    { label: "找真实案例", value: 36 },
    { label: "了解工具选型", value: 28 },
    { label: "对接潜在客户", value: 21 },
    { label: "学习实施路径", value: 15 },
  ],
};

// —————— Components ——————

function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  hint,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: number;
  hint: string;
  accent: "primary" | "accent" | "warning" | "success";
}) {
  const up = delta >= 0;
  const accentMap = {
    primary: "from-primary/15 to-primary/0 text-primary",
    accent: "from-accent/20 to-accent/0 text-accent",
    warning: "from-[var(--warning)]/20 to-transparent text-[var(--warning)]",
    success: "from-[var(--success)]/20 to-transparent text-[var(--success)]",
  } as const;
  return (
    <Card className="relative overflow-hidden border-border/60 shadow-[var(--shadow-card)]">
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl ${accentMap[accent]}`}
      />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </CardDescription>
          <div className={`rounded-lg p-2 bg-gradient-to-br ${accentMap[accent]}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-semibold tracking-tight tabular-nums text-foreground">
            {value}
          </div>
          <div
            className={`flex items-center gap-0.5 text-xs font-medium ${
              up ? "text-[var(--success)]" : "text-destructive"
            }`}
          >
            {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(delta)}%
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function SectionCard({
  title,
  desc,
  children,
  action,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {desc && <CardDescription className="mt-1 text-xs">{desc}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function PortraitBar({ items, accent }: { items: { label: string; value: number }[]; accent: string }) {
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-foreground/80">{it.label}</span>
            <span className="font-medium tabular-nums text-muted-foreground">{it.value}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${it.value}%`, background: accent }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Dashboard() {
  const [mode, setMode] = useState<DataMode>("total");
  const modeMeta = MODE_META[mode];
  const trend = useMemo(() => buildTrend(30, mode), [mode]);
  const channels = CHANNELS_BY_MODE[mode];

  const totals = useMemo(() => {
    const clicks = trend.reduce((s, d) => s + d.clicks, 0);
    const signups = trend.reduce((s, d) => s + d.signups, 0);
    const ctrBase = mode === "paid" ? 0.112 : 0.082;
    const impressions = Math.round(clicks / ctrBase);
    const ctr = ((clicks / impressions) * 100).toFixed(2);
    const spend = mode === "paid" ? Math.round(clicks * 5.8 + signups * 18) : 0;
    const cpa = mode === "paid" ? Math.round(spend / signups) : 0;
    return { clicks, signups, impressions, ctr, spend, cpa };
  }, [mode, trend]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-xl text-primary-foreground shadow-[var(--shadow-glow)]"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight">2026 全球 AI 应用峰会</h1>
                <Badge variant="secondary" className="rounded-full text-[10px]">
                  报名中
                </Badge>
              </div>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                2026.07.18 · 上海国际会议中心 · 主办方视角
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-xl border border-border bg-background/80 p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setMode("total")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === "total" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                总数据
              </button>
              <button
                type="button"
                onClick={() => setMode("paid")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === "paid" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                推广数据
              </button>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Share2 className="h-3.5 w-3.5" /> 分享
            </Button>
            <Button size="sm" className="gap-1.5" style={{ background: "var(--gradient-primary)" }}>
              <Download className="h-3.5 w-3.5" /> 导出报告
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <section className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-[var(--shadow-card)] md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full text-[10px]">{modeMeta.badge}</Badge>
              <span className="text-sm font-medium text-foreground">当前视图：{modeMeta.label}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{modeMeta.description}</p>
          </div>
          {mode === "paid" && (
            <div className="grid grid-cols-2 gap-3 text-xs md:min-w-[260px]">
              <div className="rounded-xl bg-muted/50 p-3">
                <div className="text-muted-foreground">推广花费</div>
                <div className="mt-1 text-lg font-semibold tabular-nums">¥{totals.spend.toLocaleString()}</div>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <div className="text-muted-foreground">报名 CPA</div>
                <div className="mt-1 text-lg font-semibold tabular-nums">¥{totals.cpa}</div>
              </div>
            </div>
          )}
        </section>

        {/* KPI row */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            icon={Eye}
            label="曝光数"
            value={totals.impressions.toLocaleString()}
            delta={12.4}
            hint="较上一周期"
            accent="primary"
          />
          <KpiCard
            icon={MousePointerClick}
            label="点击数"
            value={totals.clicks.toLocaleString()}
            delta={8.7}
            hint={`日均 ${Math.round(totals.clicks / trend.length).toLocaleString()}`}
            accent="accent"
          />
          <KpiCard
            icon={Target}
            label="点击率 CTR"
            value={`${totals.ctr}%`}
            delta={-1.2}
            hint="行业基准 7.5%"
            accent="warning"
          />
          <KpiCard
            icon={UserCheck}
            label="报名数"
            value={totals.signups.toLocaleString()}
            delta={18.9}
            hint={`转化率 ${((totals.signups / totals.clicks) * 100).toFixed(1)}%`}
            accent="success"
          />
        </section>

        {/* Trends */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-semibold">点击 · 报名 日度走势</CardTitle>
                <CardDescription className="mt-1 text-xs">
                  按日聚合，悬浮查看明细
                </CardDescription>
              </div>
              <Tabs defaultValue="both">
                <TabsList className="h-8">
                  <TabsTrigger value="both" className="text-xs">综合</TabsTrigger>
                  <TabsTrigger value="clicks" className="text-xs">点击</TabsTrigger>
                  <TabsTrigger value="signups" className="text-xs">报名</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <AreaChart data={trend} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gSignups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        fontSize: 12,
                        boxShadow: "var(--shadow-card)",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      name="点击"
                      stroke="var(--chart-1)"
                      strokeWidth={2.5}
                      fill="url(#gClicks)"
                    />
                    <Area
                      type="monotone"
                      dataKey="signups"
                      name="报名"
                      stroke="var(--chart-2)"
                      strokeWidth={2.5}
                      fill="url(#gSignups)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Channels */}
          <SectionCard title={mode === "paid" ? "推广来源渠道" : "报名来源渠道"} desc="渠道贡献占比">
            <div className="h-[200px] w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={channels}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={78}
                    paddingAngle={2}
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    {channels.map((c) => (
                      <Cell key={c.name} fill={c.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-2">
              {channels.map((c) => {
                const total = channels.reduce((s, x) => s + x.value, 0);
                const pct = ((c.value / total) * 100).toFixed(1);
                return (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.color }} />
                      <span className="text-foreground/80">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-3 tabular-nums">
                      <span className="text-muted-foreground">{c.value.toLocaleString()}</span>
                      <span className="w-10 text-right font-medium">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </section>

        {/* Funnel + Audience portrait */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SectionCard
            title="转化漏斗"
            desc="曝光 → 点击 → 报名"
            action={<Badge variant="outline" className="text-[10px]">实时</Badge>}
          >
            <div className="space-y-4">
              {[
                { label: "曝光", value: totals.impressions, base: totals.impressions, color: "var(--chart-1)" },
                { label: "点击", value: totals.clicks, base: totals.impressions, color: "var(--chart-2)" },
                { label: "报名", value: totals.signups, base: totals.impressions, color: "var(--chart-4)" },
              ].map((s) => {
                const pct = (s.value / s.base) * 100;
                return (
                  <div key={s.label}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium">{s.label}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {s.value.toLocaleString()} · {pct.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
              <div className="mt-2 rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">洞察：</span>
                {modeMeta.insight}
              </div>
            </div>
          </SectionCard>

          <Card className="border-border/60 shadow-[var(--shadow-card)] lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">报名用户画像</CardTitle>
                  <CardDescription className="mt-1 text-xs">
                    根据报名问卷字段自动生成 · 4 个问题
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="rounded-full text-[10px]">
                  样本 {totals.signups.toLocaleString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-3 text-xs font-medium text-muted-foreground">
                    Q1 · 所在行业
                  </div>
                  <PortraitBar items={SURVEY.industry} accent="var(--gradient-primary)" />
                </div>
                <div>
                  <div className="mb-3 text-xs font-medium text-muted-foreground">
                    Q2 · 职级
                  </div>
                  <PortraitBar items={SURVEY.role} accent="var(--gradient-accent)" />
                </div>
                <div>
                  <div className="mb-3 text-xs font-medium text-muted-foreground">
                    Q3 · 所在城市 TOP6
                  </div>
                  <div className="h-[180px]">
                    <ResponsiveContainer>
                      <BarChart data={SURVEY.city} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip
                          cursor={{ fill: "var(--muted)" }}
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 12,
                            fontSize: 12,
                          }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--chart-1)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <div className="mb-3 text-xs font-medium text-muted-foreground">
                    Q4 · 参会意向
                  </div>
                  <div className="flex h-[180px] items-center">
                    <div className="h-full w-full">
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={SURVEY.intent}
                            dataKey="value"
                            nameKey="label"
                            innerRadius={40}
                            outerRadius={72}
                            paddingAngle={3}
                            stroke="var(--card)"
                            strokeWidth={2}
                          >
                            {SURVEY.intent.map((_, i) => (
                              <Cell key={i} fill={`var(--chart-${i + 1})`} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: "var(--card)",
                              border: "1px solid var(--border)",
                              borderRadius: 12,
                              fontSize: 12,
                            }}
                          />
                          <Legend
                            verticalAlign="middle"
                            align="right"
                            layout="vertical"
                            iconType="circle"
                            wrapperStyle={{ fontSize: 11 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="pt-2 pb-6 text-center text-xs text-muted-foreground">
          数据每 5 分钟自动更新 · 支持总数据/推广数据切换 · 画像维度由报名问卷配置动态生成
        </footer>
      </main>
    </div>
  );
}
