import Relay from 'react-relay';

import LogoutMutation from '../mutation/LogoutMutation';

export default function logout (user, callbacks) {
  Relay.Store.commitUpdate(
    new LogoutMutation({ user: user }),
    callbacks
  );
}