import types from './Type';

export const ChangeHeaderState = ({ commit }, data) => {
  commit(types.CHANGE_HEADER, {
    HeaderIsHome: data.isHome,
    HeaderTitle: data.Title
  })
}