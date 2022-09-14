/*
export function someMutation (state) {
}
*/

export function SET_WX_CONFIG (state, res) {
  state.wxCofig = res
}

export function SET_WX_AGENT_CONFIG (state, res) {
  state.wxAgentCofig = res
}

export function SET_QW_USER_INFO (state, res) {
  state.qwUserInfo = res
}

export function SET_EXTERNAL_USER_ID (state, res) {
  state.qw_external_userid = res
}
