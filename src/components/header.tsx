import Link from "next/link";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-neutral-800 px-4 py-1.75 text-sm">
      <h1 className="font-medium tracking-wide">
        <Link href="/">{title}</Link>
      </h1>
      <Link href="/how">How does this work?</Link>
    </header>
  );
}
