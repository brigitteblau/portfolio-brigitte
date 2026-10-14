/**
 * El único elemento gráfico del sitio: un asterisco de 8 brazos.
 * Aparece como firma (menú, ícono) y como acento que gira con el scroll.
 */
export function Asterisk({ className, color = "currentColor", title }: { className?: string; color?: string; title?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      {[0, 45, 90, 135].map((d) => (
        <rect key={d} x="44" y="4" width="12" height="92" rx="6" fill={color} transform={`rotate(${d} 50 50)`} />
      ))}
    </svg>
  );
}
