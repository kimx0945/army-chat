type Props = {
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "w-8 h-8 text-[10px]",
  md: "w-10 h-10 text-xs",
  lg: "w-16 h-16 text-base",
};

export default function BtsAvatar({ size = "md" }: Props) {
  return (
    <div
      className={`${sizeMap[size]} rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0 select-none`}
    >
      BTS
    </div>
  );
}
