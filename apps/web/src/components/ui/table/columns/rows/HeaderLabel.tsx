function HeaderLabel(label: string) {
  return () => {
    return <span className="text-primary-text-light font-semibold capitalize">{label}</span>;
  };
}

export default HeaderLabel;
