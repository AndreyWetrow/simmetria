module.exports = {
  filename: "smart-grid",
  outputStyle: "scss",
  columns: 12,
  offset: "30px",
  // offset: "3%",
  mobileFirst: false,
  container: {
    maxWidth: "1050px", 
    fields: "50px" //хотя бы полловина offset
  },
  breakPoints: {
    lg: {
      width: "1200px",
      // fields: "15px"
    },
    md: {
      width: "992px",
      // fields: "15px"
    },
    sd: {
      width: "768px"
    },
    xs: {
      width: "480px"
    },
    xxs: {
      width: "320px"
    }
  },
  mixinNames: {
    container: "container",
    row: "row-flex",
    rowFloat: "row-float",
    rowInlineBlock: "row-ib",
    rowOffsets: "row-offsets",
    column: "col",
    size: "size",
    columnFloat: "col-float",
    columnInlineBlock: "col-ib",
    columnPadding: "col-padding",
    columnOffsets: "col-offsets",
    shift: "shift",
    from: "from",
    to: "to",
    fromTo: "from-to",
    reset: "reset",
    clearfix: "clearfix",
    debug: "debug",
    uRowFlex: "u-row-flex",
    uColumn: "u-col",
    uSize: "u-size"
  },
  tab: "    ",
  defaultMediaDevice: "screen",
  detailedCalc: false
};