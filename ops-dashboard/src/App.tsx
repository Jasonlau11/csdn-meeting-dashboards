import { useState } from "react";
import { format, subDays } from "date-fns";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  Calendar,
  CalendarPlus,
  DollarSign,
  Eye,
  Globe,
  Megaphone,
  Search,
  Sparkles,
  Target,
  UserPlus,
  Users,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ============ MOCK DATA ============
const trend30 = Array.from({ length: 30 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const base = 800 + Math.sin(i / 3) * 180 + i * 12;
  return {
    date: `${d.getMonth() + 1}/${d.getDate()}`,
    dau: Math.round(base + Math.random() * 120),
    create: Math.round(8 + Math.sin(i / 4) * 4 + Math.random() * 5),
    register: Math.round(base * 0.18 + Math.random() * 40),
  };
});

const mainFunnel = [
  { name: "首页 UV", value: 24830 },
  { name: "详情页 UV", value: 12450 },
  { name: "点击会议数", value: 4180 },
  { name: "报名", value: 1640 },
  { name: "签到", value: 980 },
];

const retention = [
  { day: "次日", v: 38 },
  { day: "3日", v: 24 },
  { day: "7日", v: 18 },
  { day: "14日", v: 12 },
  { day: "30日", v: 8 },
];

// ---- Tab 2: 流量与获客 ----
const sources = [
  { name: "自然搜索", value: 38, utm: "google / bing / baidu" },
  { name: "直接访问", value: 27, utm: "direct" },
  { name: "社交分享", value: 18, utm: "x / wechat / xhs" },
  { name: "外链推荐", value: 11, utm: "referral" },
  { name: "投流 / 邮件", value: 6, utm: "utm_campaign" },
];

const searchTerms = [
  { kw: "ai agent", c: 412, zero: false, ctr: 31.2 },
  { kw: "web3 meetup", c: 308, zero: false, ctr: 24.1 },
  { kw: "ai agent 培训", c: 38, zero: true, ctr: 0 },
  { kw: "rust meetup", c: 21, zero: true, ctr: 0 },
  { kw: "产品经理 周末", c: 31, zero: true, ctr: 0 },
  { kw: "前端架构", c: 184, zero: false, ctr: 18.7 },
  { kw: "独立开发者", c: 27, zero: true, ctr: 0 },
  { kw: "design engineer", c: 142, zero: false, ctr: 21.4 },
];

const devices = [
  { name: "手机", v: 65 },
  { name: "PC", v: 35 },
];

const cities = [
  { name: "北京", v: 24 },
  { name: "上海", v: 21 },
  { name: "深圳", v: 17 },
  { name: "杭州", v: 12 },
  { name: "成都", v: 8 },
  { name: "线上", v: 18 },
];

// ---- 总览: 会议形式分布 ----
const byForm = [
  { name: "线下", v: 52 },
  { name: "线上", v: 31 },
  { name: "混合", v: 17 },
];

// ---- 总览: TOP 会议榜 ----
const topMeetings = [
  { title: "AI Agent 实战 Meetup · 北京", uv: 5210, detailClicks: 1626, reg: 142, bounces: 938, detailCtr: 31.2, regRate: 8.7, bounceRate: 18, stay: "03:12" },
  { title: "RWA 落地工作坊", uv: 3820, detailClicks: 1085, reg: 118, bounces: 840, detailCtr: 28.4, regRate: 10.9, bounceRate: 22, stay: "02:54" },
  { title: "前端架构圆桌 #12", uv: 3410, detailClicks: 822, reg: 96, bounces: 716, detailCtr: 24.1, regRate: 11.7, bounceRate: 21, stay: "02:31" },
  { title: "Solo Builder 周会", uv: 2840, detailClicks: 645, reg: 81, bounces: 738, detailCtr: 22.7, regRate: 12.6, bounceRate: 26, stay: "02:18" },
  { title: "Design Engineer Night", uv: 2310, detailClicks: 457, reg: 64, bounces: 647, detailCtr: 19.8, regRate: 14.0, bounceRate: 28, stay: "02:02" },
  { title: "AI 出海产品分享", uv: 1980, detailClicks: 343, reg: 55, bounces: 475, detailCtr: 17.3, regRate: 16.0, bounceRate: 24, stay: "01:48" },
];

// ---- Tab 3: 主办方 ----
const organizerTier = [
  { tier: "头部 (≥5 场/月)", n: 8, share: 32, color: "chart-1" },
  { tier: "腰部 (2-4 场/月)", n: 34, share: 41, color: "chart-2" },
  { tier: "长尾 (1 场/月)", n: 62, share: 21, color: "chart-3" },
  { tier: "沉默 (近30d 0 场)", n: 184, share: 6, color: "chart-5" },
];

const organizers = [
  { n: "OPC 官方", c: 12, uv: 9821, r: 642 },
  { n: "AI Builders 社区", c: 7, uv: 4210, r: 318 },
  { n: "前端早早聊", c: 6, uv: 3540, r: 241 },
  { n: "Web3 Hangzhou", c: 4, uv: 1820, r: 132 },
  { n: "Design Engineer Club", c: 3, uv: 1240, r: 88 },
  { n: "Solo Builders CN", c: 3, uv: 980, r: 71 },
];

// ---- Tab 3: 广告投放分析 ----
const adOrganizers = [
  { org: "OPC 官方", spend: 12800, target: "报名量", meetings: 4, exposure: 98000, clicks: 6800, regs: 420, expected: 380, rate: 110.5, cpa: 30.48 },
  { org: "AI Builders 社区", spend: 8500, target: "点击量", meetings: 3, exposure: 72000, clicks: 5200, regs: 310, expected: 350, rate: 88.6, cpa: 27.42 },
  { org: "前端早早聊", spend: 6200, target: "曝光量", meetings: 2, exposure: 140000, clicks: 4200, regs: 240, expected: 280, rate: 85.7, cpa: 25.83 },
  { org: "Web3 Hangzhou", spend: 4800, target: "报名量", meetings: 2, exposure: 38000, clicks: 3100, regs: 210, expected: 180, rate: 116.7, cpa: 22.86 },
  { org: "Design Engineer Club", spend: 3200, target: "点击量", meetings: 1, exposure: 28000, clicks: 2400, regs: 140, expected: 150, rate: 93.3, cpa: 22.86 },
  { org: "Solo Builders CN", spend: 2100, target: "曝光量", meetings: 1, exposure: 48000, clicks: 1200, regs: 80, expected: 110, rate: 72.7, cpa: 26.25 },
];

// ============ HELPERS ============
function Kpi({
  icon: Icon,
  label,
  value,
  delta,
  positive = true,
  hint,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </span>
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <div className="mt-3 text-2xl lg:text-3xl font-semibold tabular-nums">
          {value}
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs">
          {delta && (
            <>
              {positive ? (
                <ArrowUpRight className="size-3.5 text-emerald-600" />
              ) : (
                <ArrowDownRight className="size-3.5 text-rose-600" />
              )}
              <span
                className={positive ? "text-emerald-600" : "text-rose-600"}
              >
                {delta}
              </span>
            </>
          )}
          <span className="text-muted-foreground">{hint ?? "vs 上周"}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function SimpleMetricCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          {label}
        </div>
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
        {unit && (
          <div className="text-xs text-muted-foreground mt-1">{unit}</div>
        )}
      </CardContent>
    </Card>
  );
}

function SectionTitle({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between mt-2 mb-1">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {children}
      </h2>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

// ============ DATE RANGE PICKER ============
function DateRangePicker() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-accent hover:text-accent-foreground h-9">
          <Calendar className="size-4 text-muted-foreground" />
          {range?.from ? (
            range.to ? (
              <span className="tabular-nums">
                {format(range.from, "yyyy/MM/dd")} —{" "}
                {format(range.to, "yyyy/MM/dd")}
              </span>
            ) : (
              format(range.from, "yyyy/MM/dd")
            )
          ) : (
            <span className="text-muted-foreground">选择日期区间</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={(r) => {
            setRange(r);
            if (r?.from && r?.to) setOpen(false);
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}

// ============ DASHBOARD ============
export function Dashboard() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              运营数据看板
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              DevCon · 全链路业务健康度与增长漏斗
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              数据正常 · 5 分钟前
            </Badge>
            <DateRangePicker />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-5">
          <TabsList className="grid w-full max-w-3xl grid-cols-3">
            <TabsTrigger value="overview">① 总览</TabsTrigger>
            <TabsTrigger value="traffic">② 流量与获客</TabsTrigger>
            <TabsTrigger value="organizer">③ 主办方 & 供给</TabsTrigger>
          </TabsList>

          {/* ==================== TAB 1: 总览 ==================== */}
          <TabsContent value="overview" className="space-y-5">
            {/* 规模 */}
            <SectionTitle hint="累计指标，会办人视角">规模</SectionTitle>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Kpi
                icon={CalendarPlus}
                label="会议总数"
                value="312"
                delta="+18"
                hint="vs 上月"
              />
              <Kpi icon={Eye} label="累计 UV" value="184,210" delta="+12.4%" />
              <Kpi icon={Users} label="累计注册用户" value="9,842" delta="+6.1%" />
              <Kpi
                icon={Building2}
                label="累计主办方"
                value="288"
                delta="+9"
                hint="vs 上月"
              />
            </div>

            {/* 今日 */}
            <SectionTitle hint="实时今日数据">今日</SectionTitle>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Kpi
                icon={Activity}
                label="DAU"
                value="1,284"
                delta="+8.2%"
                hint="vs 昨日"
              />
              <Kpi
                icon={UserPlus}
                label="新增注册"
                value="42"
                delta="-3"
                positive={false}
                hint="vs 昨日"
              />
              <Kpi
                icon={Sparkles}
                label="新增会议"
                value="6"
                delta="+2"
                hint="vs 昨日"
              />
              <Kpi
                icon={Eye}
                label="新增点击会议数"
                value="318"
                delta="+11.4%"
                hint="vs 昨日"
              />
            </div>

            {/* 趋势 + 主漏斗 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">
                    趋势 · 近 30 天 DAU / 会议创建 / 报名
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={trend30}>
                      <defs>
                        <linearGradient id="dau" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="0%"
                            stopColor="var(--color-chart-1)"
                            stopOpacity={0.45}
                          />
                          <stop
                            offset="100%"
                            stopColor="var(--color-chart-1)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                      />
                      <YAxis
                        yAxisId="l"
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                      />
                      <YAxis
                        yAxisId="r"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                      />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Area
                        yAxisId="l"
                        type="monotone"
                        dataKey="dau"
                        name="DAU"
                        stroke="var(--color-chart-1)"
                        fill="url(#dau)"
                      />
                      <Line
                        yAxisId="l"
                        type="monotone"
                        dataKey="register"
                        name="报名数"
                        stroke="var(--color-chart-4)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Bar
                        yAxisId="r"
                        dataKey="create"
                        name="会议创建"
                        fill="var(--color-chart-2)"
                        opacity={0.7}
                        radius={[4, 4, 0, 0]}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    主漏斗 · 首页 → 签到
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mainFunnel.map((f, i) => {
                    const pct = (f.value / mainFunnel[0].value) * 100;
                    const drop =
                      i === 0
                        ? 0
                        : 100 - (f.value / mainFunnel[i - 1].value) * 100;
                    return (
                      <div key={f.name}>
                        <div className="flex items-baseline justify-between text-sm">
                          <span className="font-medium">{f.name}</span>
                          <span className="tabular-nums text-muted-foreground">
                            {f.value.toLocaleString()}{" "}
                            <span className="text-xs">
                              ({pct.toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                        <Progress value={pct} className="h-2 mt-1.5" />
                        {i > 0 && (
                          <div className="text-xs text-rose-600 mt-1">
                            ↓ 上一步流失 {drop.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* 留存曲线 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  留存曲线 (N 日回访比例)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={retention}>
                    <defs>
                      <linearGradient id="ret" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
                    <YAxis tickLine={false} axisLine={false} fontSize={11} unit="%" />
                    <Tooltip />
                    <Area type="monotone" dataKey="v" stroke="var(--color-chart-3)" fill="url(#ret)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 会议形式分布 */}
            <SectionTitle hint="会议数量按形式分布">会议形式分布</SectionTitle>
            <div className="grid grid-cols-3 gap-4">
              {byForm.map((f) => (
                <SimpleMetricCard
                  key={f.name}
                  label={f.name}
                  value={`${f.v}%`}
                  unit="占比"
                />
              ))}
            </div>

            {/* TOP 会议榜 */}
            <SectionTitle hint="按 UV 排序，覆盖详情点击、报名与跳出指标">
              TOP 会议榜
            </SectionTitle>
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <Table className="min-w-[1180px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>会议</TableHead>
                      <TableHead className="text-right">UV</TableHead>
                      <TableHead className="text-right">详情页点击数</TableHead>
                      <TableHead className="text-right">报名数</TableHead>
                      <TableHead className="text-right">跳出数</TableHead>
                      <TableHead className="text-right">详情页点击率</TableHead>
                      <TableHead className="text-right">报名率</TableHead>
                      <TableHead className="text-right">跳出率</TableHead>
                      <TableHead className="text-right">人均停留时长</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topMeetings.map((m, i) => (
                      <TableRow key={m.title}>
                        <TableCell className="text-muted-foreground tabular-nums">{i + 1}</TableCell>
                        <TableCell className="font-medium">{m.title}</TableCell>
                        <TableCell className="text-right tabular-nums">{m.uv.toLocaleString()}</TableCell>
                        <TableCell className="text-right tabular-nums">{m.detailClicks.toLocaleString()}</TableCell>
                        <TableCell className="text-right tabular-nums">{m.reg}</TableCell>
                        <TableCell className="text-right tabular-nums">{m.bounces.toLocaleString()}</TableCell>
                        <TableCell className="text-right tabular-nums">{m.detailCtr}%</TableCell>
                        <TableCell className="text-right tabular-nums">{m.regRate}%</TableCell>
                        <TableCell className="text-right tabular-nums">{m.bounceRate}%</TableCell>
                        <TableCell className="text-right tabular-nums">{m.stay}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 搜索 → 点击 → 报名 */}
            <SectionTitle hint="站内搜索转化漏斗">搜索转化</SectionTitle>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Search className="size-4" /> 搜索 → 点击 → 报名
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-semibold tabular-nums">
                      1,824
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      搜索次数
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-semibold tabular-nums">
                      421
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      点击 · 23.1%
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-semibold tabular-nums">68</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      报名 · 16.2%
                    </div>
                  </div>
                </div>
                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      搜索→点击 CTR
                    </span>
                    <span className="tabular-nums font-medium">23.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      点击→报名 CVR
                    </span>
                    <span className="tabular-nums font-medium">16.2%</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">搜索→报名 整体</span>
                    <span className="tabular-nums font-semibold text-emerald-600">
                      3.7%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== TAB 2: 流量与获客 ==================== */}
          <TabsContent value="traffic" className="space-y-5">
            <SectionTitle hint="流量从哪来 · 哪些渠道 ROI 高">
              来源结构
            </SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="size-4" /> 注册用户来源渠道
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={sources}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                      >
                        {sources.map((_, i) => (
                          <Cell
                            key={i}
                            fill={`var(--color-chart-${(i % 5) + 1})`}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-3 text-xs">
                    {sources.map((s, i) => (
                      <div key={s.name} className="flex items-center gap-2">
                        <span
                          className="size-2 rounded-sm shrink-0"
                          style={{
                            background: `var(--color-chart-${(i % 5) + 1})`,
                          }}
                        />
                        <span>{s.name}</span>
                        <span className="text-muted-foreground text-[10px]">
                          {s.utm}
                        </span>
                        <span className="ml-auto tabular-nums font-medium">
                          {s.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">设备分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={devices} layout="vertical" margin={{ top: 0, right: 18, bottom: 0, left: 0 }}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        fontSize={11}
                        axisLine={false}
                        tickLine={false}
                        unit="%"
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                        width={60}
                      />
                      <Tooltip />
                      <Bar dataKey="v" radius={[0, 6, 6, 0]}>
                        {devices.map((_, i) => (
                          <Cell
                            key={i}
                            fill={`var(--color-chart-${i + 1})`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">新老用户比</span>
                    <span className="tabular-nums font-medium">
                      65% : 35%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">注册用户城市分布 Top 6</CardTitle>
                </CardHeader>
                <CardContent className="flex min-h-[260px] items-center justify-center px-6 pb-6 pt-2">
                  <div className="h-[190px] w-full max-w-[360px] -translate-x-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cities} margin={{ top: 12, right: 28, bottom: 4, left: -8 }}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        fontSize={11}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        fontSize={11}
                        axisLine={false}
                        tickLine={false}
                        unit="%"
                      />
                      <Tooltip />
                      <Bar
                        dataKey="v"
                        radius={[6, 6, 0, 0]}
                        fill="var(--color-chart-2)"
                      />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <SectionTitle hint="0 结果词 = 用户在找但你还没有 = 补内容 / 补供给信号">
              搜索词 Top
            </SectionTitle>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>关键词</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">搜索次数</TableHead>
                      <TableHead className="text-right">点击率</TableHead>
                      <TableHead className="text-right">建议动作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchTerms.map((r) => (
                      <TableRow key={r.kw}>
                        <TableCell className="font-medium">{r.kw}</TableCell>
                        <TableCell>
                          {r.zero ? (
                            <Badge variant="destructive">0 结果</Badge>
                          ) : (
                            <Badge variant="secondary">有结果</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {r.c}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {r.zero ? "—" : `${r.ctr}%`}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {r.zero ? "补供给 / 同义词映射" : "持续运营"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== TAB 3: 主办方 & 供给 ==================== */}
          <TabsContent value="organizer" className="space-y-5">
            <SectionTitle hint="供给侧规模">主办方规模</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Kpi
                icon={Building2}
                label="主办方总数"
                value="288"
                delta="+9"
                hint="vs 上月"
              />
              <Kpi
                icon={Activity}
                label="活跃主办方"
                value="104"
                delta="+12.3%"
                hint="近 30d 发过会议"
              />
              <Kpi
                icon={CalendarPlus}
                label="人均发会数"
                value="2.7"
                delta="+0.3"
              />
            </div>

            <SectionTitle hint="供给侧分层结构">
              主办方流量分层
            </SectionTitle>
            <Card>
              <CardContent className="space-y-4 pt-6">
                {organizerTier.map((t) => (
                  <div key={t.tier}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{t.tier}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {t.n} 人 · 贡献 {t.share}% 流量
                      </span>
                    </div>
                    <div className="h-2 mt-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${t.share}%`,
                          background: `var(--color-${t.color})`,
                        }}
                      />
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-2 border-t">
                  头部 + 腰部 (42 人, 14.6%) 贡献了 73% 流量 ·
                  典型长尾分布。
                </p>
              </CardContent>
            </Card>

            {/* ---- 广告投放分析 ---- */}
            <SectionTitle hint="办会人广告支出与投放效果">
              广告投放分析
            </SectionTitle>

            {/* 投放概览 KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Kpi icon={DollarSign} label="总投放金额" value="¥48,600" delta="+18.4%" hint="vs 上月" />
              <Kpi icon={Megaphone} label="投放中会议数" value="23" delta="+5" hint="vs 上月" />
              <Kpi icon={Eye} label="广告曝光数" value="424,000" delta="+16.8%" />
              <Kpi icon={Target} label="广告点击数" value="28,500" delta="+12.6%" />
              <Kpi icon={Activity} label="广告点击率" value="6.72%" delta="+0.4%" />
              <Kpi icon={UserPlus} label="广告带来报名" value="1,840" delta="+22.1%" />
              <Kpi icon={Target} label="平均获客成本" value="¥26.41" delta="3.2" positive={false} hint="CPA ↓ 即优化" />
            </div>

            {/* 主办方投放明细 */}
            <SectionTitle hint="按投放金额排序，达成率 < 80% 标红">
              主办方投放明细
            </SectionTitle>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>主办方</TableHead>
                      <TableHead className="text-right">投放金额</TableHead>
                      <TableHead className="text-right">投放目标</TableHead>
                      <TableHead className="text-right">在投会议</TableHead>
                      <TableHead className="text-right">获得曝光</TableHead>
                      <TableHead className="text-right">获得点击</TableHead>
                      <TableHead className="text-right">获得报名</TableHead>
                      <TableHead className="text-right">达成率</TableHead>
                      <TableHead className="text-right">CPA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adOrganizers.map((a) => (
                      <TableRow key={a.org}>
                        <TableCell className="font-medium">{a.org}</TableCell>
                        <TableCell className="text-right tabular-nums font-medium">
                          ¥{a.spend.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="text-[10px]">
                            {a.target}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {a.meetings}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {a.exposure.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {a.clicks.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {a.regs}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          <span
                            className={
                              a.rate >= 100
                                ? "text-emerald-600 font-medium"
                                : a.rate >= 80
                                  ? "text-amber-600"
                                  : "text-rose-600 font-medium"
                            }
                          >
                            {a.rate.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          ¥{a.cpa.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <SectionTitle hint="人均效能">主办方贡献排行</SectionTitle>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>主办方</TableHead>
                      <TableHead className="text-right">活动数</TableHead>
                      <TableHead className="text-right">累计 UV</TableHead>
                      <TableHead className="text-right">单场均 UV</TableHead>
                      <TableHead className="text-right">累计报名</TableHead>
                      <TableHead className="text-right">单场均报名</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizers.map((o) => (
                      <TableRow key={o.n}>
                        <TableCell className="font-medium">{o.n}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {o.c}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {o.uv.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {Math.round(o.uv / o.c)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {o.r}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {(o.r / o.c).toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center pt-4">
          数据为 Mock 示意 · 接入真实埋点后自动替换 · 字段已对齐 dwd_event
          / dws_user_daily / dws_meeting_daily
        </p>
      </main>
    </div>
  );
}
