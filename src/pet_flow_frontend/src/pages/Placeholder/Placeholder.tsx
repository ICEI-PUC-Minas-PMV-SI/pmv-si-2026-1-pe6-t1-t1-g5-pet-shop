interface PlaceholderProps {
  title: string;
}

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#141313' }}>{title}</h1>
      <p style={{ fontSize: 14, color: 'rgba(20,19,19,0.57)', marginTop: 8 }}>
        Em construção...
      </p>
    </div>
  );
}
