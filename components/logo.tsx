type LogoProps = {
  size?: number
  className?: string
}

export function Logo({ size = 28, className }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/image.png"
      alt="SALVIA"
      style={{ height: size, width: "auto" }}
      className={className}
    />
  )
}

