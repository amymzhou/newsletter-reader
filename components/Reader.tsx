export function Reader({ content }: { content: string }) {
  return (
    <div
      className="prose mx-auto"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
