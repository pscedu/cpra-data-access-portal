const Columns = ({ items, columns = 4, breakpoint = "sm" }) => {
  const rows = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(
      <div class="row">
        {items.slice(i, i + columns).map((item) => (
          <div key={item} class={`col-${breakpoint}-${12 / columns}`}>
            {item}
          </div>
        ))}
      </div>
    );
  }
  return rows;
};

export default Columns;
