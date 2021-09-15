import AbstractView from './abstract';

const createMainNavigationTemplate = () => (
  `<nav class="main-navigation">

    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class MainNavigation extends AbstractView {
  getTemplate() {
    return createMainNavigationTemplate();
  }
}
