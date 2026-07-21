/**
 * @rrt-nextjs/design-system
 *
 * The single source of truth for RRT brand: tokens, primitives, and
 * compositions. Consumed by the operations apps rrt-studio and rrt-app via
 * pinned GitHub commit references; the rrt-nextjs marketing site does not
 * consume this package.
 *
 * Reference: docs/spec/01-design-system.md
 */

// ----------------------------------------------------------------------------
// Library helpers
// ----------------------------------------------------------------------------
export {
  cn,
  initialsFor,
  initialsColorHash,
  firstNameOf,
  TONE_KEYS,
  type ProgramToneKey,
} from './lib/utils';

export {
  colors,
  programTones,
  radius,
  motion,
  type ProgramId,
} from './lib/tokens';

// ----------------------------------------------------------------------------
// shadcn-pattern primitives (src/components/ui)
// ----------------------------------------------------------------------------
export {
  Button,
  buttonVariants,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from './components/ui/button';

export {
  Input,
  inputVariants,
  type InputProps,
  type InputSize,
} from './components/ui/input';

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';

export {
  Combobox,
  type ComboboxOption,
  type ComboboxProps,
} from './components/ui/combobox';

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  type DialogContentProps,
  type DialogSize,
} from './components/ui/dialog';

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
  type SheetContentProps,
} from './components/ui/sheet';

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
  type ToastVariant,
} from './components/ui/toast';

export { Banner, type BannerProps } from './components/ui/banner';

export { Badge, type BadgeProps, type BadgeVariant } from './components/ui/badge';

export { Pill, type PillProps } from './components/ui/pill';

export {
  ProgramChip,
  type ProgramChipProps,
} from './components/ui/program-chip';

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './components/ui/tooltip';

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  type DropdownMenuItemProps,
} from './components/ui/dropdown-menu';

export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './components/ui/tabs';

export {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableHeadProps,
  type TableRowProps,
  type SortState,
} from './components/ui/table';

export { FormField, type FormFieldProps } from './components/ui/form-field';

export { Switch, type SwitchProps } from './components/ui/switch';

export { Checkbox } from './components/ui/checkbox';

export {
  RadioGroup,
  RadioGroupItem,
} from './components/ui/radio-group';

export { Pagination, type PaginationProps } from './components/ui/pagination';

export {
  EmptyState,
  type EmptyStateProps,
  type EmptyStateIllustration,
} from './components/ui/empty-state';

export { ErrorState, type ErrorStateProps } from './components/ui/error-state';

export {
  LoadingState,
  type LoadingStateProps,
} from './components/ui/loading-state';

export { IconButton, type IconButtonProps } from './components/ui/icon-button';

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  type CommandDialogProps,
} from './components/ui/command';

// ----------------------------------------------------------------------------
// Bespoke RRT primitives (src/components)
// ----------------------------------------------------------------------------
export {
  Avatar,
  type AvatarProps,
  type AvatarSize,
  type AvatarStatus,
  type AvatarFlag,
  type AvatarSurface,
} from './components/avatar';

export {
  Tile,
  TileSkeleton,
  type TileProps,
  type TileSize,
} from './components/tile';

export {
  PhotoUploader,
  type PhotoUploaderProps,
} from './components/photo-uploader';

export {
  ConsentForm,
  type ConsentFormProps,
  type ConsentFormPayload,
} from './components/consent-form';

export {
  RibbonMark,
  type RibbonMarkProps,
  type RibbonTone,
} from './components/ribbon-mark';

export { Wordmark, type WordmarkProps } from './components/wordmark';
