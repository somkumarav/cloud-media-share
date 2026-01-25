export const UploadProgressBar = ({ progressWidth }: { progressWidth: number }) => {
  return (
    <div
      className={"h-1 w-full bg-accent-background rounded-full"}
    >
      <div
        style={{ width: `${progressWidth}%` }}
        className={"h-1 min-w-1 bg-accent-foreground rounded-full"}
      ></div>
    </div>
  )
}