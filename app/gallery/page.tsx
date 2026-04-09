import { getSupabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const supabase = getSupabaseServer();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, name, email, gender, status, result_url, photo_url, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const completedSessions = sessions?.filter((s) => s.result_url) || [];
  const totalSessions = sessions?.length || 0;
  const completedCount = completedSessions.length;

  return (
    <div className="min-h-screen bg-[#1D1D1B] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#FFCF00]">
              My Play Festival — Photo Gallery
            </h1>
            <p className="text-white/60 mt-2">
              {completedCount} generated / {totalSessions} total sessions
            </p>
          </div>
          <a
            href="/"
            className="px-6 py-3 bg-[#E3000B] text-white rounded-full font-bold hover:bg-red-700 transition"
          >
            Back to Kiosk
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Sessions" value={totalSessions} color="#006CB7" />
          <StatCard label="Completed" value={completedCount} color="#92BF3A" />
          <StatCard
            label="Processing"
            value={sessions?.filter((s) => s.status === "processing").length || 0}
            color="#F68215"
          />
          <StatCard
            label="Errors"
            value={sessions?.filter((s) => s.status === "error").length || 0}
            color="#E3000B"
          />
        </div>

        {/* Gallery Grid */}
        {completedSessions.length === 0 ? (
          <div className="text-center py-20 text-white/40 text-xl">
            No photos generated yet
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {completedSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-[#FFCF00]/50 transition"
              >
                {/* Generated Image */}
                <div className="aspect-[9/16] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={session.result_url}
                    alt={`${session.name}'s minifigure`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-[#FFCF00]">
                    {session.name}
                  </h3>
                  <p className="text-white/50 text-sm">{session.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        session.gender === "male"
                          ? "bg-[#006CB7]/30 text-[#33B3E2]"
                          : "bg-[#E978A3]/30 text-[#E978A3]"
                      }`}
                    >
                      {session.gender}
                    </span>
                    <span className="text-xs text-white/30">
                      {new Date(session.created_at).toLocaleString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <a
                      href={session.result_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-sm px-3 py-2 bg-[#006CB7] rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      View Full
                    </a>
                    {session.photo_url && (
                      <a
                        href={session.photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-2 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition"
                      >
                        Original
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-5 border border-white/10"
      style={{ backgroundColor: `${color}15` }}
    >
      <p className="text-white/50 text-sm">{label}</p>
      <p className="text-3xl font-bold mt-1" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
