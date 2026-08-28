const FullScreenLoader = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-soft-pulse">
      <div className="w-6 h-6 rounded-full bg-primary animate-soft-pulse" />
    </div>
    <p className="text-sm text-muted-foreground font-medium">Carregando Doe+ RS...</p>
  </div>
);

export default FullScreenLoader;
