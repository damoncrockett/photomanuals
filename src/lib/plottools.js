function gridCoords(n,ncol) {

  const nrow = Math.ceil( n / ncol )
  const xgrid = Array(nrow).fill(Array.from(Array(ncol).keys())).flat().slice(0,n);
  const ygrid = Array.from(Array(nrow).keys()).map(d => Array(ncol).fill(d)).flat().slice(0,n);
  const coords = [xgrid,ygrid];

  return coords;
}

export { gridCoords };
