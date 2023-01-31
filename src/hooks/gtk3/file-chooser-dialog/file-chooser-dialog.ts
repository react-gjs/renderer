import Gio from "gi://Gio";
import Gtk from "gi://Gtk";
import React from "react";
import { useIsMounted } from "../../is-mounted";

declare global {
  namespace Rg {
    type FileChooserDialogParams = {
      /** The label of the accept button. */
      acceptLabel?: string;
      /**
       * Whether the user should be able to create a new directory
       * from the dialog.
       */
      allowCreateDir?: boolean;
      /**
       * Whether the interactions with the parent window should be
       * prevented while the `FileChooserDialog` is open.
       */
      blockParentWindow?: boolean;
      /** The label of the cancel button. */
      cancelLabel?: string;
      /** The default file name to use when saving. */
      defaultFileName?: string;
      /**
       * The label of the filters dropdown. If not provided, no label
       * will be shown.
       */
      filtersLabel?: string;
      /**
       * The filters to use in the dialog. Only files that match the
       * glob patterns in the selected filter will be shown in the
       * dialog.
       */
      filters?: Array<{
        /** Whether this filter should be selected by default. */
        isDefault?: boolean;
        /** The label of the filter. */
        label: string;
        /**
         * A list of glob patterns, if a file matches any of these
         * patterns, it will be shown in the dialog.
         */
        patterns: string[];
      }>;
      /**
       * Whether the dialog should only allow the user to select files
       * that are local to the machine.
       */
      localOnly?: boolean;
      /**
       * The path to the directory that the dialog should open to. If
       * not provided, the dialog will open to the user's home
       * directory.
       */
      openDirPath?: string;
      /**
       * Whether the dialog should prompt the user to confirm
       * overwriting an existing file.
       */
      requireOverwriteConfirmation?: boolean;
      /**
       * Whether the dialog should show hidden files and directories.
       *
       * @default false
       */
      showHiddenFiles?: boolean;
      /** The title of the dialog. */
      title?: string;
      /**
       * A list of directory paths that should be displayed along user
       * default shortcuts in the dialog.
       */
      shortcuts?: Array<string>;
    };
  }
}

type FileChooserApi<F> = {
  /**
   * The file or files that the user selected in the dialog. If the
   * user cancelled the dialog, this will remain as it was.
   */
  file: F | undefined;
  /** The filter that were active when the user selected a file(s). */
  filter:
    | {
        isDefault?: boolean | undefined;
        label: string;
        patterns: string[];
      }
    | undefined;
  /**
   * Opens the FileChooserDialog and returns a promise that resolves
   * once the user selects a file or cancels the dialog.
   */
  openDialog: (params: Rg.FileChooserDialogParams) => Promise<F | undefined>;
  /**
   * Clears the selected file(s) and filter. This will not close the
   * dialog if it is open.
   */
  clearSelection: () => void;
  /**
   * Closes the dialog if it is open. This will not clear the selected
   * file(s) and filter.
   */
  forceCloseDialog: () => void;
};

class FileChooserFilterController {
  private activeFilter?: number;

  constructor(
    private dialog: Gtk.FileChooserNative,
    private filters: Required<Rg.FileChooserDialogParams>["filters"],
    label: string
  ) {
    const extraWidget = new Gtk.Box();
    extraWidget.set_margin_start(3);
    extraWidget.set_margin_top(3);
    extraWidget.set_margin_bottom(3);

    if (label) {
      const extraWidgetLabel = new Gtk.Label({ label });
      extraWidgetLabel.set_margin_end(5);
      extraWidgetLabel.set_margin_start(5);
      extraWidget.add(extraWidgetLabel);
    }

    extraWidget.add(this.choiceWidget());

    extraWidget.show_all();
    this.dialog.set_extra_widget(extraWidget);
  }

  private choiceWidget() {
    const comboBox = new Gtk.ComboBoxText();

    for (const index in this.filters) {
      const option = this.filters[index];

      comboBox.append(index, option.label);

      if (option.isDefault) {
        const i = parseInt(index);
        comboBox.set_active(i);
        this.applyFilter(i);
      }
    }

    comboBox.connect("changed", (_) => {
      const filterIndex = comboBox.get_active_id();

      if (!filterIndex || filterIndex === "-1") {
        this.applyFilter();
      } else {
        this.applyFilter(parseInt(filterIndex));
      }
    });

    return comboBox;
  }

  private applyFilter(index?: number) {
    if (this.activeFilter === index) {
      return;
    }

    this.activeFilter = index;

    if (index === undefined) {
      this.dialog.set_filter(new Gtk.FileFilter());
    } else {
      const filter = new Gtk.FileFilter();

      for (const pattern of this.filters[index].patterns) {
        filter.add_pattern(pattern);
      }

      this.dialog.set_filter(filter);
    }
  }

  getActiveFilter() {
    if (this.activeFilter === undefined || this.activeFilter === -1) {
      return undefined;
    }

    return this.filters[this.activeFilter];
  }
}

export function useFileChooser(
  action: Gtk.FileChooserAction,
  selectMultiple: true
): FileChooserApi<Gio.File[]>;
export function useFileChooser(
  action: Gtk.FileChooserAction,
  selectMultiple: false
): FileChooserApi<Gio.File>;
export function useFileChooser(
  action: Gtk.FileChooserAction,
  selectMultiple: boolean
): any {
  const isMounted = useIsMounted();
  const [file, setFile] = React.useState<Gio.File | Gio.File[]>();
  const [filter, setFilter] =
    React.useState<Required<Rg.FileChooserDialogParams>["filters"][number]>();
  const dialogWidget = React.useRef<Gtk.FileChooserNative>();

  const openDialog = React.useCallback(
    (params: Rg.FileChooserDialogParams) => {
      return new Promise<Gio.File | Gio.File[] | undefined>(
        (resolve, reject) => {
          if (dialogWidget.current) {
            return reject(new Error("This FileChooserDialog is already open."));
          }

          try {
            const dialog = new Gtk.FileChooserNative();
            dialogWidget.current = dialog;

            const app = Gio.Application.get_default() as Gtk.Application;

            dialog.set_transient_for(app.active_window);
            dialog.set_action(action);

            if (params.acceptLabel) {
              dialog.set_accept_label(params.acceptLabel);
            }

            if (params.cancelLabel) {
              dialog.set_cancel_label(params.cancelLabel);
            }

            if (params.title) {
              dialog.set_title(params.title);
            }

            if (params.openDirPath) {
              dialog.set_current_folder(params.openDirPath);
            }

            if (params.localOnly !== undefined) {
              dialog.set_local_only(params.localOnly);
            }

            if (params.showHiddenFiles !== undefined) {
              dialog.set_show_hidden(params.showHiddenFiles);
            }

            if (
              action === Gtk.FileChooserAction.CREATE_FOLDER ||
              action === Gtk.FileChooserAction.SAVE
            ) {
              if (params.defaultFileName) {
                dialog.set_current_name(params.defaultFileName);
              }

              if (params.requireOverwriteConfirmation !== undefined) {
                dialog.set_do_overwrite_confirmation(
                  params.requireOverwriteConfirmation
                );
              }

              if (params.allowCreateDir !== undefined) {
                dialog.set_create_folders(params.allowCreateDir);
              }
            }

            let filters: FileChooserFilterController;
            if (params.filters) {
              filters = new FileChooserFilterController(
                dialog,
                params.filters,
                params.filtersLabel ?? ""
              );
            }

            if (params.shortcuts) {
              for (const shortcut of params.shortcuts) {
                dialog.add_shortcut_folder(shortcut);
              }
            }

            dialog.connect("response", (_, response) => {
              if (isMounted.current) {
                if (response === Gtk.ResponseType.ACCEPT) {
                  setFilter(filters?.getActiveFilter());
                  if (selectMultiple) {
                    const files = dialog.get_files();
                    setFile(files);
                    return resolve(files);
                  } else {
                    const file = dialog.get_file();
                    setFile(file);
                    return resolve(file);
                  }
                } else {
                  return resolve(undefined);
                }
              }

              dialogWidget.current = undefined;
              dialog.destroy();
            });

            if (params.blockParentWindow === true) {
              dialog.run();
            } else {
              dialog.show();
            }
          } catch (error) {
            dialogWidget.current = undefined;
            return reject(error);
          }
        }
      );
    },
    [action, selectMultiple]
  );

  const clearSelection = React.useCallback(() => {
    setFile(undefined);
    setFilter(undefined);
  }, []);

  const forceCloseDialog = React.useCallback(() => {
    if (dialogWidget.current) {
      dialogWidget.current.destroy();
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (dialogWidget.current) {
        dialogWidget.current.destroy();
      }
    };
  }, []);

  return { file, filter, openDialog, clearSelection, forceCloseDialog };
}
