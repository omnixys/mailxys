import type { Theme } from "@mui/material/styles";
import { appBarComponents } from "./appBar";
import { buttonComponents } from "./button";
import { cardComponents } from "./card";
import { chipComponents } from "./chip";
import {
  dialogActionsComponents,
  dialogComponents,
  dialogContentComponents,
  dialogTitleComponents,
} from "./dialog";
import { drawerComponents } from "./drawer";
import { listItemComponents } from "./listItem";
import { paperComponents } from "./paper";
import { textFieldComponents } from "./textField";
import { tooltipComponents } from "./tooltip";

export const createComponentOverrides = (theme: Theme) => ({
  MuiButton: buttonComponents(theme),
  MuiPaper: paperComponents(theme),
  MuiDialog: dialogComponents(theme),
  MuiDialogTitle: dialogTitleComponents(theme),
  MuiDialogContent: dialogContentComponents(theme),
  MuiDialogActions: dialogActionsComponents(theme),
  MuiTextField: textFieldComponents(theme),
  MuiCard: cardComponents(theme),
  MuiChip: chipComponents(theme),
  MuiDrawer: drawerComponents(theme),
  MuiAppBar: appBarComponents(theme),
  MuiTooltip: tooltipComponents(theme),
  MuiListItemButton: listItemComponents(theme),
});
