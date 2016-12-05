export default [
    { name: 'home',         path: '/' },
    { name: 'report', path: '/report' },
    { name: 'report.preset', path: '/preset/:state',
      onActivate : (params) => {
        try {
          return {
            type : 'LOAD_PRESET',
            payload : JSON.parse(params.state)
          }
        } catch (err) {
          return {
            type : 'LOAD_PRESET_ERROR',
            payload : [err]
          }
        }
      }
    }
];
