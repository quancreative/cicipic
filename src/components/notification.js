const { Notification } = require( 'electron' );

exports.notify = (msg) => {
    const notif = new Notification( {
        title: msg,
        body: `${ msg }`
    } );

    notif.show();
}