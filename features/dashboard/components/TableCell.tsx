export const TableCell = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`truncate ${className}`}
      title={typeof children === "string" ? children : ""}
    >
      {children}
    </div>
  )
}
