"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  FlaskConical,
  Droplets,
  SlidersHorizontal,
  Beaker,
} from "lucide-react";

type Mode = "recipe" | "dilution";
type AromaMode = "percent" | "ml";

type StatusState =
  | {
      message: string;
      ok: boolean;
    }
  | null;

function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatMl(value: number) {
  const n = round2(value);
  return Number.isInteger(n) ? `${n} ml` : `${n.toFixed(2).replace(".", ",")} ml`;
}

function formatMg(value: number) {
  const n = round2(value);
  return Number.isInteger(n) ? `${n} mg/ml` : `${n.toFixed(2).replace(".", ",")} mg/ml`;
}

function formatPercent(value: number) {
  const n = round2(value);
  return Number.isInteger(n) ? `${n} %` : `${n.toFixed(2).replace(".", ",")} %`;
}

type RecipeResult =
  | {
      error: string;
    }
  | {
      nicotineBaseMl: number;
      aromaMl: number;
      neutralBaseMl: number;
      neutralPgMl: number;
      neutralVgMl: number;
      targetPgMl: number;
      targetVgMl: number;
      currentPgMl: number;
      currentVgMl: number;
      nicotineBaseRatio: number;
      aromaRatio: number;
      neutralBaseRatio: number;
    };

type DilutionResult =
  | {
      error: string;
    }
  | {
      sourceBaseToUseMl: number;
      neutralBaseToAddMl: number;
      finalVolumeMl: number;
    };

export default function CalculateurELiquidePage() {
  const [mode, setMode] = useState<Mode>("recipe");
  const [status, setStatus] = useState<StatusState>(null);

  // ===== MODE RECETTE COMPLETE =====
  const [finalVolume, setFinalVolume] = useState<number>(70);
  const [targetNicotine, setTargetNicotine] = useState<number>(6);
  const [sourceNicotine, setSourceNicotine] = useState<number>(20);

  const [aromaMode, setAromaMode] = useState<AromaMode>("percent");
  const [aromaPercent, setAromaPercent] = useState<number>(15);
  const [aromaMlFixed, setAromaMlFixed] = useState<number>(10);

  const [targetPg, setTargetPg] = useState<number>(50);
  const [targetVg, setTargetVg] = useState<number>(50);

  const [sourcePg, setSourcePg] = useState<number>(50);
  const [sourceVg, setSourceVg] = useState<number>(50);

  const [aromaPg, setAromaPg] = useState<number>(100);
  const [aromaVg, setAromaVg] = useState<number>(0);

  // ===== MODE DILUTION SIMPLE =====
  const [dilutionStartNicotine, setDilutionStartNicotine] = useState<number>(12);
  const [dilutionStartVolume, setDilutionStartVolume] = useState<number>(100);
  const [dilutionTargetNicotine, setDilutionTargetNicotine] = useState<number>(6);

  const quickVolumes = [30, 60, 70, 100, 120, 200];
  const targetNicotinePresets = [0, 3, 6, 10, 12];
  const sourceNicotinePresets = [6, 10, 12, 18, 20];
  const ratios = [
    { pg: 50, vg: 50, label: "50/50" },
    { pg: 30, vg: 70, label: "30/70" },
    { pg: 20, vg: 80, label: "20/80" },
    { pg: 70, vg: 30, label: "70/30" },
  ];

  const recipeResult = useMemo<RecipeResult>(() => {
    if (
      Number.isNaN(finalVolume) ||
      Number.isNaN(targetNicotine) ||
      Number.isNaN(sourceNicotine) ||
      Number.isNaN(aromaPercent) ||
      Number.isNaN(aromaMlFixed) ||
      Number.isNaN(targetPg) ||
      Number.isNaN(targetVg) ||
      Number.isNaN(sourcePg) ||
      Number.isNaN(sourceVg) ||
      Number.isNaN(aromaPg) ||
      Number.isNaN(aromaVg)
    ) {
      return { error: "Merci de remplir tous les champs avec des valeurs valides." };
    }

    if (finalVolume <= 0) {
      return { error: "Le volume final doit être supérieur à 0." };
    }

    if (targetNicotine < 0) {
      return { error: "La nicotine cible ne peut pas être négative." };
    }

    if (sourceNicotine <= 0 && targetNicotine > 0) {
      return { error: "La force de la base nicotinée source doit être supérieure à 0." };
    }

    if (sourceNicotine < targetNicotine) {
      return {
        error:
          "La nicotine de la base source est inférieure à la nicotine cible. Le mélange est impossible.",
      };
    }

    if (targetPg + targetVg !== 100) {
      return { error: "Le ratio cible PG/VG doit faire 100%." };
    }

    if (sourcePg + sourceVg !== 100) {
      return { error: "Le ratio PG/VG de la base nicotinée doit faire 100%." };
    }

    if (aromaPg + aromaVg !== 100) {
      return { error: "Le ratio PG/VG du concentré doit faire 100%." };
    }

    let aromaMl = 0;

    if (aromaMode === "percent") {
      if (aromaPercent < 0 || aromaPercent > 100) {
        return { error: "L’arôme en pourcentage doit être compris entre 0 et 100." };
      }
      aromaMl = finalVolume * (aromaPercent / 100);
    } else {
      if (aromaMlFixed < 0 || aromaMlFixed > finalVolume) {
        return {
          error: "Le volume de concentré doit être compris entre 0 et le volume final.",
        };
      }
      aromaMl = aromaMlFixed;
    }

    const nicotineBaseMl =
      targetNicotine === 0 ? 0 : (finalVolume * targetNicotine) / sourceNicotine;

    const neutralBaseMl = finalVolume - nicotineBaseMl - aromaMl;

    if (neutralBaseMl < 0) {
      return {
        error:
          "Le mélange est impossible : base nicotinée + concentré dépassent le volume final.",
      };
    }

    const targetPgMl = finalVolume * (targetPg / 100);
    const targetVgMl = finalVolume * (targetVg / 100);

    const sourcePgMl = nicotineBaseMl * (sourcePg / 100);
    const sourceVgMl = nicotineBaseMl * (sourceVg / 100);

    const aromaPgMl = aromaMl * (aromaPg / 100);
    const aromaVgMl = aromaMl * (aromaVg / 100);

    const currentPgMl = sourcePgMl + aromaPgMl;
    const currentVgMl = sourceVgMl + aromaVgMl;

    const neutralPgMl = targetPgMl - currentPgMl;
    const neutralVgMl = targetVgMl - currentVgMl;

    if (neutralPgMl < -0.01 || neutralVgMl < -0.01) {
      return {
        error:
          "Le ratio PG/VG demandé est impossible avec cette base nicotinée et ce concentré.",
      };
    }

    return {
      nicotineBaseMl,
      aromaMl,
      neutralBaseMl,
      neutralPgMl: Math.max(0, neutralPgMl),
      neutralVgMl: Math.max(0, neutralVgMl),
      targetPgMl,
      targetVgMl,
      currentPgMl,
      currentVgMl,
      nicotineBaseRatio: (nicotineBaseMl / finalVolume) * 100,
      aromaRatio: (aromaMl / finalVolume) * 100,
      neutralBaseRatio: (neutralBaseMl / finalVolume) * 100,
    };
  }, [
    finalVolume,
    targetNicotine,
    sourceNicotine,
    aromaMode,
    aromaPercent,
    aromaMlFixed,
    targetPg,
    targetVg,
    sourcePg,
    sourceVg,
    aromaPg,
    aromaVg,
  ]);

  const dilutionResult = useMemo<DilutionResult>(() => {
    if (
      Number.isNaN(dilutionStartNicotine) ||
      Number.isNaN(dilutionStartVolume) ||
      Number.isNaN(dilutionTargetNicotine)
    ) {
      return { error: "Merci de remplir tous les champs avec des valeurs valides." };
    }

    if (dilutionStartVolume <= 0) {
      return { error: "Le volume de départ doit être supérieur à 0." };
    }

    if (dilutionStartNicotine <= 0) {
      return { error: "La nicotine de départ doit être supérieure à 0." };
    }

    if (dilutionTargetNicotine < 0) {
      return { error: "La nicotine cible ne peut pas être négative." };
    }

    if (dilutionTargetNicotine > dilutionStartNicotine) {
      return {
        error:
          "La nicotine cible est supérieure à la nicotine de départ. La dilution est impossible.",
      };
    }

    if (dilutionTargetNicotine === 0) {
      return {
        error:
          "Pour atteindre 0 mg/ml, la dilution devient théoriquement infinie. Mets une valeur > 0.",
      };
    }

    const finalVolumeMl =
      (dilutionStartNicotine * dilutionStartVolume) / dilutionTargetNicotine;

    const neutralBaseToAddMl = finalVolumeMl - dilutionStartVolume;

    return {
      sourceBaseToUseMl: dilutionStartVolume,
      neutralBaseToAddMl,
      finalVolumeMl,
    };
  }, [dilutionStartNicotine, dilutionStartVolume, dilutionTargetNicotine]);

  function handleCalculate() {
    if (mode === "recipe") {
      if ("error" in recipeResult) {
        setStatus({ message: recipeResult.error, ok: false });
        return;
      }
      setStatus({ message: "Calcul effectué avec succès.", ok: true });
      return;
    }

    if ("error" in dilutionResult) {
      setStatus({ message: dilutionResult.error, ok: false });
      return;
    }

    setStatus({ message: "Calcul effectué avec succès.", ok: true });
  }

  function resetRecipe() {
    setFinalVolume(70);
    setTargetNicotine(6);
    setSourceNicotine(20);
    setAromaMode("percent");
    setAromaPercent(15);
    setAromaMlFixed(10);
    setTargetPg(50);
    setTargetVg(50);
    setSourcePg(50);
    setSourceVg(50);
    setAromaPg(100);
    setAromaVg(0);
    setStatus(null);
  }

  function resetDilution() {
    setDilutionStartNicotine(12);
    setDilutionStartVolume(100);
    setDilutionTargetNicotine(6);
    setStatus(null);
  }

  const recipeSafe = "error" in recipeResult ? null : recipeResult;
  const dilutionSafe = "error" in dilutionResult ? null : dilutionResult;

  return (
    <main className="min-h-screen bg-[#F2F4F7] text-[#0F172A] relative overflow-hidden">
      <div className="absolute inset-x-0 top-[10px] flex justify-center pointer-events-none">
        <img
          src="/logo-lysma.png"
          alt=""
          className="w-[380px] opacity-[0.18] select-none"
        />
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#1E73D8] hover:text-[#0A4D9B] transition mb-6 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour au Hub
        </Link>

        <section className="relative z-10 max-w-4xl mx-auto text-center px-2 pt-8 pb-14">
          <h1 className="text-4xl md:text-6xl font-semibold mb-5 tracking-tight text-[#0A4D9B]">
            Calculateur e-liquide
          </h1>

          <p className="text-lg md:text-xl text-[#1E73D8] max-w-3xl mx-auto">
            Un outil propre, clair et complet pour préparer une recette, gérer une dilution
            nicotinée et contrôler précisément les équilibres PG/VG.
          </p>
        </section>

        <section className="relative z-10 max-w-6xl mx-auto mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setMode("recipe");
                setStatus(null);
              }}
              className={[
                "group rounded-3xl p-6 border transition-all duration-300 text-left",
                mode === "recipe"
                  ? "border-[#DCE3EC] bg-white/85 shadow-[0_14px_34px_rgba(15,23,42,0.08)]"
                  : "border-[#E2E8F0] bg-white/70 hover:shadow-[0_10px_30px_rgba(15,23,42,0.05)]",
              ].join(" ")}
            >
              <div className="mb-4 w-12 h-12 rounded-xl bg-[#E8F1FB] flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-[#0A4D9B]" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-[#0F172A] group-hover:text-[#0A4D9B] transition">
                Recette complète
              </h2>
              <p className="text-[#6B7280] leading-relaxed">
                Volume final, nicotine cible, base nicotinée source, arôme et calcul PG/VG.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("dilution");
                setStatus(null);
              }}
              className={[
                "group rounded-3xl p-6 border transition-all duration-300 text-left",
                mode === "dilution"
                  ? "border-[#DCE3EC] bg-white/85 shadow-[0_14px_34px_rgba(15,23,42,0.08)]"
                  : "border-[#E2E8F0] bg-white/70 hover:shadow-[0_10px_30px_rgba(15,23,42,0.05)]",
              ].join(" ")}
            >
              <div className="mb-4 w-12 h-12 rounded-xl bg-[#E8F1FB] flex items-center justify-center">
                <Droplets className="w-5 h-5 text-[#0A4D9B]" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-[#0F172A] group-hover:text-[#0A4D9B] transition">
                Dilution simple
              </h2>
              <p className="text-[#6B7280] leading-relaxed">
                Tu as déjà une base nicotinée et tu veux la diluer avec de la base neutre.
              </p>
            </button>
          </div>
        </section>

        {mode === "recipe" ? (
          <section className="relative z-10 max-w-7xl mx-auto grid xl:grid-cols-[1.05fr_.95fr] gap-6">
            <Card>
              <SectionHeader
                kicker="Paramètres"
                title="Préparation complète"
                icon={<SlidersHorizontal className="w-5 h-5 text-[#0A4D9B]" />}
              />

              <div className="mb-6">
                <MiniTitle>Volumes rapides</MiniTitle>
                <div className="grid grid-cols-3 gap-2">
                  {quickVolumes.map((v) => (
                    <QuickButton
                      key={v}
                      active={finalVolume === v}
                      onClick={() => {
                        setFinalVolume(v);
                        setStatus(null);
                      }}
                    >
                      {v} ml
                    </QuickButton>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <MiniTitle>Nicotine cible</MiniTitle>
                <div className="flex flex-wrap gap-2 mb-3">
                  {targetNicotinePresets.map((preset) => (
                    <ChipButton
                      key={preset}
                      active={targetNicotine === preset}
                      onClick={() => {
                        setTargetNicotine(preset);
                        setStatus(null);
                      }}
                    >
                      {preset} mg/ml
                    </ChipButton>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <Field
                    label="Volume final (ml)"
                    value={finalVolume}
                    onChange={(value) => {
                      setFinalVolume(value);
                      setStatus(null);
                    }}
                  />
                  <Field
                    label="Nicotine cible (mg/ml)"
                    value={targetNicotine}
                    step="1"
                    onChange={(value) => {
                      setTargetNicotine(value);
                      setStatus(null);
                    }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <MiniTitle>Base nicotinée source</MiniTitle>
                <div className="flex flex-wrap gap-2 mb-3">
                  {sourceNicotinePresets.map((preset) => (
                    <ChipButton
                      key={preset}
                      active={sourceNicotine === preset}
                      onClick={() => {
                        setSourceNicotine(preset);
                        setStatus(null);
                      }}
                    >
                      {preset} mg/ml
                    </ChipButton>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <Field
                    label="Force nicotine source"
                    value={sourceNicotine}
                    step="1"
                    onChange={(value) => {
                      setSourceNicotine(value);
                      setStatus(null);
                    }}
                  />
                  <Field
                    label="PG base source (%)"
                    value={sourcePg}
                    onChange={(value) => {
                      setSourcePg(value);
                      setStatus(null);
                    }}
                  />
                  <Field
                    label="VG base source (%)"
                    value={sourceVg}
                    onChange={(value) => {
                      setSourceVg(value);
                      setStatus(null);
                    }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <MiniTitle>Concentré / arôme</MiniTitle>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <QuickButton
                    active={aromaMode === "percent"}
                    onClick={() => {
                      setAromaMode("percent");
                      setStatus(null);
                    }}
                  >
                    Arôme en %
                  </QuickButton>

                  <QuickButton
                    active={aromaMode === "ml"}
                    onClick={() => {
                      setAromaMode("ml");
                      setStatus(null);
                    }}
                  >
                    Concentré en ml
                  </QuickButton>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  {aromaMode === "percent" ? (
                    <Field
                      label="Arôme (%)"
                      value={aromaPercent}
                      step="1"
                      onChange={(value) => {
                        setAromaPercent(value);
                        setStatus(null);
                      }}
                    />
                  ) : (
                    <Field
                      label="Concentré prévu (ml)"
                      value={aromaMlFixed}
                      step="1"
                      onChange={(value) => {
                        setAromaMlFixed(value);
                        setStatus(null);
                      }}
                    />
                  )}

                  <Field
                    label="PG concentré (%)"
                    value={aromaPg}
                    onChange={(value) => {
                      setAromaPg(value);
                      setStatus(null);
                    }}
                  />

                  <Field
                    label="VG concentré (%)"
                    value={aromaVg}
                    onChange={(value) => {
                      setAromaVg(value);
                      setStatus(null);
                    }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <MiniTitle>Ratio final souhaité</MiniTitle>

                <div className="flex flex-wrap gap-2 mb-3">
                  {ratios.map((ratio) => (
                    <ChipButton
                      key={ratio.label}
                      active={targetPg === ratio.pg && targetVg === ratio.vg}
                      onClick={() => {
                        setTargetPg(ratio.pg);
                        setTargetVg(ratio.vg);
                        setStatus(null);
                      }}
                    >
                      {ratio.label}
                    </ChipButton>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <Field
                    label="PG cible (%)"
                    value={targetPg}
                    onChange={(value) => {
                      setTargetPg(value);
                      setStatus(null);
                    }}
                  />
                  <Field
                    label="VG cible (%)"
                    value={targetVg}
                    onChange={(value) => {
                      setTargetVg(value);
                      setStatus(null);
                    }}
                  />
                </div>
              </div>

              <ActionRow
                onCalculate={handleCalculate}
                onReset={resetRecipe}
                status={status}
              />
            </Card>

            <Card>
              <SectionHeader
                kicker="Résultat"
                title="Lecture finale"
                icon={<Beaker className="w-5 h-5 text-[#0A4D9B]" />}
              />

              <ResultHero
                title="Base neutre à compléter"
                value={formatMl(recipeSafe?.neutralBaseMl ?? 0)}
                items={[
                  { label: "Nicotine cible", value: formatMg(targetNicotine) },
                  {
                    label: aromaMode === "percent" ? "Arôme" : "Concentré",
                    value:
                      aromaMode === "percent"
                        ? formatPercent(aromaPercent)
                        : formatMl(recipeSafe?.aromaMl ?? aromaMlFixed),
                  },
                  {
                    label: "Base nicotinée",
                    value: formatMl(recipeSafe?.nicotineBaseMl ?? 0),
                  },
                  { label: "Volume final", value: formatMl(finalVolume) },
                ]}
              />

              <div className="grid grid-cols-2 gap-3 mt-4">
                <SummaryCard label="Base nicotinée" value={formatMl(recipeSafe?.nicotineBaseMl ?? 0)} />
                <SummaryCard
                  label={aromaMode === "percent" ? "Concentré" : "Concentré"}
                  value={formatMl(recipeSafe?.aromaMl ?? 0)}
                />
                <SummaryCard label="Base neutre totale" value={formatMl(recipeSafe?.neutralBaseMl ?? 0)} />
                <SummaryCard label="Ratio cible" value={`${targetPg}/${targetVg}`} />
              </div>

              <DetailBlock title="Répartition de la base neutre">
                <PrepItem
                  index={1}
                  label="PG neutre à ajouter"
                  value={formatMl(recipeSafe?.neutralPgMl ?? 0)}
                />
                <PrepItem
                  index={2}
                  label="VG neutre à ajouter"
                  value={formatMl(recipeSafe?.neutralVgMl ?? 0)}
                />
              </DetailBlock>

              <DetailBlock title="Répartition globale du mélange">
                <PrepItem
                  index={1}
                  label="Base nicotinée"
                  value={`${formatMl(recipeSafe?.nicotineBaseMl ?? 0)} • ${formatPercent(
                    recipeSafe?.nicotineBaseRatio ?? 0
                  )}`}
                />
                <PrepItem
                  index={2}
                  label={aromaMode === "percent" ? "Concentré" : "Concentré"}
                  value={`${formatMl(recipeSafe?.aromaMl ?? 0)} • ${formatPercent(
                    recipeSafe?.aromaRatio ?? 0
                  )}`}
                />
                <PrepItem
                  index={3}
                  label="Base neutre"
                  value={`${formatMl(recipeSafe?.neutralBaseMl ?? 0)} • ${formatPercent(
                    recipeSafe?.neutralBaseRatio ?? 0
                  )}`}
                />
              </DetailBlock>
            </Card>
          </section>
        ) : (
          <section className="relative z-10 max-w-7xl mx-auto grid xl:grid-cols-[1.05fr_.95fr] gap-6">
            <Card>
              <SectionHeader
                kicker="Paramètres"
                title="Dilution simple"
                icon={<Droplets className="w-5 h-5 text-[#0A4D9B]" />}
              />

              <div className="grid md:grid-cols-3 gap-3 mb-6">
                <Field
                  label="Nicotine de départ (mg/ml)"
                  value={dilutionStartNicotine}
                  step="1"
                  onChange={(value) => {
                    setDilutionStartNicotine(value);
                    setStatus(null);
                  }}
                />
                <Field
                  label="Volume de départ (ml)"
                  value={dilutionStartVolume}
                  step="1"
                  onChange={(value) => {
                    setDilutionStartVolume(value);
                    setStatus(null);
                  }}
                />
                <Field
                  label="Nicotine cible (mg/ml)"
                  value={dilutionTargetNicotine}
                  step="1"
                  onChange={(value) => {
                    setDilutionTargetNicotine(value);
                    setStatus(null);
                  }}
                />
              </div>

              <ActionRow
                onCalculate={handleCalculate}
                onReset={resetDilution}
                status={status}
              />
            </Card>

            <Card>
              <SectionHeader
                kicker="Résultat"
                title="Dilution finale"
                icon={<Beaker className="w-5 h-5 text-[#0A4D9B]" />}
              />

              <ResultHero
                title="Base neutre à ajouter"
                value={formatMl(dilutionSafe?.neutralBaseToAddMl ?? 0)}
                items={[
                  { label: "Nicotine départ", value: formatMg(dilutionStartNicotine) },
                  { label: "Nicotine cible", value: formatMg(dilutionTargetNicotine) },
                  { label: "Volume départ", value: formatMl(dilutionStartVolume) },
                  { label: "Volume final", value: formatMl(dilutionSafe?.finalVolumeMl ?? 0) },
                ]}
              />

              <div className="grid grid-cols-2 gap-3 mt-4">
                <SummaryCard label="Base départ utilisée" value={formatMl(dilutionSafe?.sourceBaseToUseMl ?? 0)} />
                <SummaryCard label="Base neutre à ajouter" value={formatMl(dilutionSafe?.neutralBaseToAddMl ?? 0)} />
                <SummaryCard label="Volume final obtenu" value={formatMl(dilutionSafe?.finalVolumeMl ?? 0)} />
                <SummaryCard label="Résultat cible" value={formatMg(dilutionTargetNicotine)} />
              </div>

              <DetailBlock title="Étapes de dilution">
                <PrepItem
                  index={1}
                  label="Conserver la base de départ"
                  value={formatMl(dilutionSafe?.sourceBaseToUseMl ?? 0)}
                />
                <PrepItem
                  index={2}
                  label="Ajouter la base neutre"
                  value={formatMl(dilutionSafe?.neutralBaseToAddMl ?? 0)}
                />
                <PrepItem
                  index={3}
                  label="Obtenir le volume final"
                  value={formatMl(dilutionSafe?.finalVolumeMl ?? 0)}
                />
              </DetailBlock>
            </Card>
          </section>
        )}
      </section>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[32px] border border-[#DCE5F0] bg-white/85 backdrop-blur-sm shadow-[0_14px_34px_rgba(15,23,42,0.08)] p-5 md:p-6">
      {children}
    </div>
  );
}

function SectionHeader({
  kicker,
  title,
  icon,
}: {
  kicker: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-xl bg-[#E8F1FB] flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-black tracking-[0.16em] uppercase text-[#1E73D8]">
            {kicker}
          </p>
          <h2 className="mt-1 text-xl md:text-2xl font-black tracking-tight">{title}</h2>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-[#0A4D9B]/20 to-transparent" />
    </div>
  );
}

function MiniTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-black tracking-[0.16em] uppercase text-[#1E73D8] mb-3">
      {children}
    </p>
  );
}

function QuickButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-10 rounded-xl text-sm font-bold transition",
        active
          ? "text-white bg-gradient-to-br from-[#0A4D9B] via-[#1E73D8] to-[#6EA8FF] shadow-[0_8px_18px_rgba(10,77,155,0.22)]"
          : "bg-[#EEF3F9] text-[#0F172A] hover:-translate-y-[1px]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-2 rounded-full text-sm font-bold border transition",
        active
          ? "bg-[#0A4D9B] text-white border-[#0A4D9B] shadow-[0_6px_16px_rgba(10,77,155,0.18)]"
          : "bg-white text-[#0F172A] border-[#DCE5F0] hover:border-[#1E73D8] hover:text-[#0A4D9B]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ActionRow({
  onCalculate,
  onReset,
  status,
}: {
  onCalculate: () => void;
  onReset: () => void;
  status: StatusState;
}) {
  return (
    <>
      <div className="grid md:grid-cols-[1.15fr_.85fr] gap-3">
        <button
          type="button"
          onClick={onCalculate}
          className="h-12 rounded-2xl font-extrabold text-white bg-gradient-to-br from-[#0A4D9B] via-[#1E73D8] to-[#6EA8FF] shadow-[0_10px_22px_rgba(10,77,155,0.22)] hover:-translate-y-[1px] transition"
        >
          Calculer
        </button>

        <button
          type="button"
          onClick={onReset}
          className="h-12 rounded-2xl font-extrabold bg-[#EEF2F7] text-[#0F172A] hover:-translate-y-[1px] transition"
        >
          Reset
        </button>
      </div>

      {status && (
        <div
          className={[
            "mt-4 rounded-2xl px-4 py-3 text-sm font-bold",
            status.ok
              ? "bg-[rgba(22,163,74,.10)] text-[#16A34A] border border-[rgba(22,163,74,.18)]"
              : "bg-[rgba(220,38,38,.10)] text-[#DC2626] border border-[rgba(220,38,38,.18)]",
          ].join(" ")}
        >
          {status.message}
        </div>
      )}
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  step = "1",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-[#6B7280] whitespace-nowrap overflow-hidden text-ellipsis">
        {label}
      </label>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={Number.isNaN(value) ? "" : value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-11 md:h-12 text-base md:text-lg px-3 rounded-[14px] border-[1.5px] border-[#DCE5F0] outline-none bg-white text-[#0F172A] focus:border-[#1E73D8] focus:shadow-[0_0_0_3px_rgba(30,115,216,0.10)] transition"
      />
    </div>
  );
}

function ResultHero({
  title,
  value,
  items,
}: {
  title: string;
  value: string;
  items: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-[26px] bg-gradient-to-br from-[#0A4D9B] via-[#1E73D8] to-[#6EA8FF] text-white shadow-[0_12px_26px_rgba(10,77,155,0.20)] p-5 flex flex-col gap-4">
      <div>
        <div className="text-[10px] font-black tracking-[0.14em] uppercase text-white/75 mb-1">
          Lecture principale
        </div>
        <div className="text-sm font-bold text-white/90 mb-1">{title}</div>
        <div className="text-4xl md:text-5xl font-black leading-none">{value}</div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/70 whitespace-nowrap">
              {item.label}
            </span>
            <span className="text-sm md:text-base font-extrabold whitespace-nowrap">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] p-4 border border-[#DCE5F0] bg-gradient-to-b from-white to-[#F7FAFE]">
      <div className="text-[11px] font-bold text-[#6B7280] mb-2 whitespace-nowrap">{label}</div>
      <div className="text-xl md:text-2xl font-black leading-none whitespace-nowrap">{value}</div>
    </div>
  );
}

function DetailBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 rounded-[22px] border border-dashed border-[rgba(10,77,155,.22)] bg-[#FBFCFF] p-4">
      <h3 className="text-base font-black mb-4">{title}</h3>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function PrepItem({
  index,
  label,
  value,
}: {
  index: number;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-white border border-[#E7ECF4] rounded-2xl px-4 py-3">
      <div className="w-7 h-7 rounded-full bg-[#EAF3FF] text-[#0A4D9B] grid place-items-center text-xs font-black shrink-0">
        {index}
      </div>
      <div className="flex-1 text-sm md:text-[15px] font-semibold leading-snug">{label}</div>
      <div className="text-sm md:text-base font-black whitespace-nowrap">{value}</div>
    </div>
  );
}