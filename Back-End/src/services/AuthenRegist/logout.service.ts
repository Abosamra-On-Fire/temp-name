import db from '@DB';


async function decrementDevices(userId: number) {
    await db.user.update({
        where: { id: userId },
        data: { loggedInDevices: { decrement: 1 } }
    });
}

async function resetDevices(userId: number) {
    await db.user.update({
        where: { id: userId },
        data: { loggedInDevices: 0 }
    });
}

export { decrementDevices, resetDevices };