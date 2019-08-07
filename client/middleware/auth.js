export default function({ store, redirect, app }) {
  if (!store.getters.user) {
    return redirect(app.localePath('signin'))
  }
}
