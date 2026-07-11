import type { Theme } from "@mui/material/styles";
import { buttonComponents } from "./button";
import {
  dialogComponents,
  dialogTitleComponents,
  dialogContentComponents,
  dialogActionsComponents,
} from "./dialog";
import { paperComponents } from "./paper";
import { textFieldComponents } from "./textField";
import { cardComponents } from "./card";
import { chipComponents } from "./chip";
import { drawerComponents } from "./drawer";
import { appBarComponents } from "./appBar";
import { tooltipComponents } from "./tooltip";
import { listItemComponents } from "./listItem";

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
