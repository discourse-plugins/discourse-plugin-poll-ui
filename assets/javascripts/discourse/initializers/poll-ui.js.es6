import { withPluginApi } from 'discourse/lib/plugin-api';
import { onToolbarCreate } from 'discourse/components/d-editor';
import NewComposer from 'discourse/components/d-editor';
import showModal from 'discourse/lib/show-modal';
import ApplicationRoute from 'discourse/routes/application';
import ComposerView from 'discourse/views/composer';

function priorToApi(container)
{
  const siteSettings = container.lookup('site-settings:main');

  if (siteSettings.poll_ui_enabled) {
    if (NewComposer !== "undefined") {
      NewComposer.reopen({
        actions: {
          showPollUI: function() {
            showModal('poll-ui').setProperties({composerView: this});
          }
        }
      });

      onToolbarCreate(toolbar => {
        toolbar.addButton({
          id: "poll_ui_button",
          group: "extras",
          icon: "bar-chart",
          action: 'showPollUI'
        });
      });
    } else {
      ApplicationRoute.reopen({
        actions: {
          showPollUI: function (composerView) {
            showModal('poll-ui');
            this.controllerFor('poll-ui').setProperties({composerViewOld: composerView});
          }
        }
      });

      ComposerView.reopen({
        initEditor: function () {
          // overwrite and wrap.
          this._super();
          var view = this;
          var button_text = I18n.t("poll_ui.composer_button_text");
          var btn = $('<button class="wmd-button wmd-poll-ui-button" title="' + button_text + '" aria-label="' + button_text + '"></button>');
          btn.click(function () {
            view.get("controller").send("showPollUI", view);
          });
          $("#wmd-button-row,.wmd-button-row").append(btn);
        }
      });
    }
  }
}

function initializePlugin(api)
{
  const siteSettings = api.container.lookup('site-settings:main');

  if (siteSettings.poll_ui_enabled) {
    if (NewComposer !== "undefined") {
      NewComposer.reopen({
        actions: {
          showPollUI: function () {
            showModal('poll-ui').setProperties({composerView: this});
          }
        }
      });

      api.onToolbarCreate(toolbar => {
        toolbar.addButton({
          id: "poll_ui_button",
          group: "extras",
          icon: "bar-chart",
          action: 'showPollUI'
        });
      });
    }
  }
}

export default
{
  name: 'poll-ui',
  initialize(container)
  {
    withPluginApi('0.1', api => initializePlugin(api), { noApi: () => priorToApi(container) });
  }
};