import types from './Type';

export const ChangeHeaderState = ({ commit }, status) => {
  commit(types.CHANGE_HEADER, {
    HeaderIsHome: status
  })
}