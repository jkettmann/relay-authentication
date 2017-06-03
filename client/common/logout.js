import Relay from 'react-relay'

import LogoutMutation from '../mutation/LogoutMutation'

function logout(user, callbacks) {
  Relay.Store.commitUpdate(
    new LogoutMutation({
      user,
    }),
    callbacks,
  )
}

export default logout
