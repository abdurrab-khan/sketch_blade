function HeaderLabel(label: string) {
  return () => {
    return <span className="text-primary-text-light/80 capitalize">{label}</span>;
  };
}

export default HeaderLabel;
