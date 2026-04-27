function HeaderLabel(label: string) {
  return () => {
    return (
      <span className="text-primary-text-light font-semibold capitalize dark:text-blue-400">
        {label}
      </span>
    );
  };
}

export default HeaderLabel;
