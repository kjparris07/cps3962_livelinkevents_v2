export default function Button({ content, link }: { content: string; link: string }) {
  return (
    <a href={link} className="membership-btn">
      {content}
    </a>
  );
}