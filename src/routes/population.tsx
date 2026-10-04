import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { populationQuery, villageQuery } from "@/lib/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/population")({
  head: () => ({
    meta: [
      { title: "Population & Household Records — Govindapoor" },
      {
        name: "description",
        content:
          "Ward-wise population, households, male and female count and registered voters of Govindapoor village.",
      },
      { property: "og:title", content: "Population & Household Records — Govindapoor" },
      { property: "og:description", content: "Ward-wise public population records." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: rows = [] } = useQuery(populationQuery);
  const { data: village } = useQuery(villageQuery);
  const sum = (k: "households" | "male" | "female" | "total" | "voters") =>
    rows.reduce((a, r) => a + (r[k] ?? 0), 0);

  return (
    <PageShell>
      <PageHero
        eyebrow="Public records"
        title="Population details"
        description={`Ward-wise population and household register of ${village?.name ?? "Govindapoor"} village.`}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal className="bg-surface overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ward</TableHead>
                <TableHead className="text-right">Households</TableHead>
                <TableHead className="text-right">Male</TableHead>
                <TableHead className="text-right">Female</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Voters</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.ward}</TableCell>
                  <TableCell className="text-right">{r.households}</TableCell>
                  <TableCell className="text-right">{r.male}</TableCell>
                  <TableCell className="text-right">{r.female}</TableCell>
                  <TableCell className="text-right font-semibold">{r.total}</TableCell>
                  <TableCell className="text-right">{r.voters}</TableCell>
                  <TableCell className="text-muted-foreground">{r.notes}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground text-center">
                    No population records published yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
            {rows.length > 0 ? (
              <TableFooter>
                <TableRow>
                  <TableCell className="font-semibold">Total</TableCell>
                  <TableCell className="text-right font-semibold">{sum("households")}</TableCell>
                  <TableCell className="text-right font-semibold">{sum("male")}</TableCell>
                  <TableCell className="text-right font-semibold">{sum("female")}</TableCell>
                  <TableCell className="text-right font-semibold">{sum("total")}</TableCell>
                  <TableCell className="text-right font-semibold">{sum("voters")}</TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            ) : null}
          </Table>
        </Reveal>
        <p className="text-muted-foreground mt-4 text-xs">
          Records are maintained by the Panchayat office and updated after every survey.
        </p>
      </section>
    </PageShell>
  );
}
