interface Props {
  variables?: Record<string, string>;
}

/** Current variable values as name=value chips. */
export function VariablesPanel({ variables }: Props) {
  if (!variables || Object.keys(variables).length === 0) return null;
  return (
    <div className="variables-panel">
      {Object.entries(variables).map(([name, value]) => (
        <div className="variable-chip" key={name}>
          <span className="variable-name">{name}</span>
          <span className="variable-value">{value}</span>
        </div>
      ))}
    </div>
  );
}
