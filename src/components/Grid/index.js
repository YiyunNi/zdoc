function GridColumn({ widthRatio, children, divider }) {
  return (
    <div style={{ flex: `${widthRatio} 0 0`, borderRight: divider ? '2px solid #ebedf0' : 'none', marginRight: divider ? '10px' : '0' }}>
      {children}
    </div>
  );
}

export default function Grid({ columnSize, widthRatios, children }) {
  const columns = [];

  for (let i = 0; i < columnSize; i++) {
    const widthRatio = widthRatios.split(',')[i];
    columns.push(
      <GridColumn key={i} widthRatio={widthRatio} divider={i === 0}>
        {children[i]}
      </GridColumn>
    );
  }

  return (
    <div style={{ display: 'flex', width: '100%', marginTop: '10px', gap: '10px' }}>
      {columns}
    </div>
  );
}