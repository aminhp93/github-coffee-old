import {
  AutoformatPlugin,
  createAlignPlugin,
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createComboboxPlugin,
  createDeserializeCsvPlugin,
  createDeserializeDocxPlugin,
  createDeserializeMdPlugin,
  createDndPlugin,
  createExitBreakPlugin,
  createFontBackgroundColorPlugin,
  createFontColorPlugin,
  createFontSizePlugin,
  // createHeadingPlugin,
  createHighlightPlugin,
  createHorizontalRulePlugin,
  createImagePlugin,
  createIndentPlugin,
  createItalicPlugin,
  createKbdPlugin,
  createLinkPlugin,
  createListPlugin,
  createMediaEmbedPlugin,
  createMentionPlugin,
  createNodeIdPlugin,
  createNormalizeTypesPlugin,
  createParagraphPlugin,
  createPlateUI,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createTablePlugin,
  createTodoListPlugin,
  createTrailingBlockPlugin,
  createUnderlinePlugin,
  ELEMENT_CODE_BLOCK,
  HeadingToolbar,
  MentionCombobox,
  Plate,
  PlateEventProvider,
  PlateFloatingLink,
  StyledElement,
} from '@udecode/plate';
import { createJuicePlugin } from '@udecode/plate-juice';
import {
  createExcalidrawPlugin,
  ELEMENT_EXCALIDRAW,
  ExcalidrawElement,
} from '@udecode/plate-ui-excalidraw';
import { useMemo, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'tippy.js/dist/tippy.css';
import { CursorOverlayContainer } from './config/components/CursorOverlayContainer';
import {
  MarkBallonToolbar,
  ToolbarButtons,
} from './config/components/Toolbars';
import { withStyledDraggables } from './config/components/withStyledDraggables';
import { CONFIG } from './config/config';
import { MENTIONABLES } from './config/mentionables';
import { createDragOverCursorPlugin } from './config/plugins';
import {
  createMyPlugins,
  MyEditor,
  MyPlatePlugin,
  MyValue,
} from './config/typescript';
import './CustomPlate.less';
import { cbUploadImage } from './utils';

const linkPlugin: any = {
  renderAfterEditable: PlateFloatingLink,
};

let components = createPlateUI({
  [ELEMENT_EXCALIDRAW]: ExcalidrawElement,
  [ELEMENT_CODE_BLOCK]: StyledElement,
  // customize your components by plugin key
});

interface IProps {
  id?: any;
  onChange?: any;
  value?: any;
  hideToolBar?: boolean;
  readOnly?: boolean;
  editableProps?: any;
}

const CustomPlate = (props: IProps) => {
  console.log('customplate', props);
  const containerRef = useRef(null);
  const plugins = useMemo(
    () =>
      createMyPlugins(
        [
          createParagraphPlugin(),
          createBlockquotePlugin(),
          createTodoListPlugin(),
          // createHeadingPlugin(),
          createImagePlugin({
            options: {
              uploadImage: cbUploadImage,
            } as any,
          }),
          createHorizontalRulePlugin(),
          createLinkPlugin(linkPlugin),
          createListPlugin(),
          createTablePlugin(),
          createMediaEmbedPlugin(),
          createExcalidrawPlugin() as MyPlatePlugin,
          createCodeBlockPlugin(),
          createAlignPlugin(CONFIG.align),
          createBoldPlugin(),
          createCodePlugin(),
          createItalicPlugin(),
          createHighlightPlugin(),
          createUnderlinePlugin(),
          createStrikethroughPlugin(),
          createSubscriptPlugin(),
          createSuperscriptPlugin(),
          createFontColorPlugin(),
          createFontBackgroundColorPlugin(),
          createFontSizePlugin(),
          createKbdPlugin(),
          createNodeIdPlugin(),
          createDndPlugin(),
          createDragOverCursorPlugin(),
          createIndentPlugin(CONFIG.indent),
          createAutoformatPlugin<
            AutoformatPlugin<MyValue, MyEditor>,
            MyValue,
            MyEditor
          >(CONFIG.autoformat),
          createResetNodePlugin(CONFIG.resetBlockType),
          createSoftBreakPlugin(CONFIG.softBreak),
          createExitBreakPlugin(CONFIG.exitBreak),
          createNormalizeTypesPlugin(CONFIG.forceLayout),
          createTrailingBlockPlugin(CONFIG.trailingBlock),
          createSelectOnBackspacePlugin(CONFIG.selectOnBackspace),
          createComboboxPlugin(),
          createMentionPlugin(),
          createDeserializeMdPlugin(),
          createDeserializeCsvPlugin(),
          createDeserializeDocxPlugin(),
          createJuicePlugin() as MyPlatePlugin,
        ],
        {
          components: withStyledDraggables(components),
        }
      ),
    []
  );

  return (
    <div className="CustomPlate height-100 width-100">
      <DndProvider backend={HTML5Backend}>
        <PlateEventProvider>
          <HeadingToolbar>
            <ToolbarButtons />
          </HeadingToolbar>
        </PlateEventProvider>

        <div
          ref={containerRef}
          style={{
            position: 'relative',
            flex: 1,
            overflow: 'auto',
          }}
        >
          <Plate<MyValue>
            editableProps={CONFIG.editableProps}
            // initialValue={VALUES.playground}
            plugins={plugins}
            {...props}
          >
            <MarkBallonToolbar />
            <MentionCombobox items={MENTIONABLES} />
            <CursorOverlayContainer containerRef={containerRef} />
          </Plate>
        </div>
      </DndProvider>
    </div>
  );
};

export default CustomPlate;
