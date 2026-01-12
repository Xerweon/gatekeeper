const LogoWithGradient = () => {
  return (
    <div className="inter-300 p-2 select-none">
      <div className="flex items-center gap-2">
        <h1 className="text-base font-medium tracking-tight flex items-baseline">
          <span className="text-zinc-300">xerw</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300 font-semibold">
            eon™
          </span>
          <span className="mx-1.5 text-zinc-600 dark:text-zinc-700">|</span>
          <div className="relative">
            <span className="font-bold text-white tracking-wide uppercase text-sm">GateKeeper</span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"></div>
          </div>
        </h1>
      </div>
    </div>
  )
}

export default LogoWithGradient
