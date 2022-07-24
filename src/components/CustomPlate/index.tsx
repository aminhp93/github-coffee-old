import 'tippy.js/dist/tippy.css';
import { useRef } from 'react';
import axios from 'axios';
import {
  createPlateUI,
  HeadingToolbar,
  MentionCombobox,
  Plate,
  createAlignPlugin,
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createExitBreakPlugin,
  // createHeadingPlugin,
  createHighlightPlugin,
  createKbdPlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createMediaEmbedPlugin,
  createNodeIdPlugin,
  createParagraphPlugin,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createDndPlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createTablePlugin,
  createTodoListPlugin,
  createTrailingBlockPlugin,
  createUnderlinePlugin,
  createComboboxPlugin,
  createMentionPlugin,
  createIndentPlugin,
  createFontColorPlugin,
  createFontBackgroundColorPlugin,
  createDeserializeMdPlugin,
  createDeserializeCsvPlugin,
  createNormalizeTypesPlugin,
  createFontSizePlugin,
  createHorizontalRulePlugin,
  createDeserializeDocxPlugin,
  PlateEventProvider,
  AutoformatPlugin,
  ELEMENT_CODE_BLOCK,
  StyledElement,
} from '@udecode/plate';
import {
  createExcalidrawPlugin,
  ELEMENT_EXCALIDRAW,
  ExcalidrawElement,
} from '@udecode/plate-ui-excalidraw';
import { createJuicePlugin } from '@udecode/plate-juice';
import {
  MarkBallonToolbar,
  ToolbarButtons,
} from './config/components/Toolbars';
import { withStyledPlaceHolders } from './config/components/withStyledPlaceHolders';
import { withStyledDraggables } from './config/components/withStyledDraggables';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MENTIONABLES } from './config/mentionables';
import { CONFIG } from './config/config';
import { VALUES } from './config/values/values';
import { createDragOverCursorPlugin } from './config/plugins';
import { CursorOverlayContainer } from './config/components/CursorOverlayContainer';
import {
  createMyPlugins,
  MyEditor,
  MyPlatePlugin,
  MyValue,
} from './config/typescript';

// Migrate to v8 - Part 1: https://www.loom.com/share/71596199ad5a47c2b58cdebab26f4642
// Migrate to v8 - Part 2: https://www.loom.com/share/d85c89220ffa4fe2b6f934a6c6530689
// Migrate to v8 - Part 3: https://www.loom.com/share/c1bf20e18d8a42f8a55f8a28ab605148

function b64toBlob(b64Data: any, contentType?: any, sliceSize?: any) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

let components = createPlateUI({
  [ELEMENT_EXCALIDRAW]: ExcalidrawElement,
  [ELEMENT_CODE_BLOCK]: StyledElement,
  // customize your components by plugin key
});
// components = withStyledPlaceHolders(components);
components = withStyledDraggables(components);

const cbUploadImage = async (data: any) => {
  // Split the base64 string in data and contentType
  const block = data.split(';');
  // Get the content type of the image
  const contentType = block[0].split(':')[1]; // In this case "image/gif"
  // get the real base64 content of the file
  const realData = block[1].split(',')[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."
  // Convert it to a blob to upload
  const blob = b64toBlob(realData, contentType);

  const dataRequest = new FormData();
  dataRequest.append('auth_token', '970165a01aa329064b5154c75c6cbc99183ddb8c');
  dataRequest.append('source', blob);
  dataRequest.append('type', 'file');
  dataRequest.append('action', 'upload');
  dataRequest.append('timestamp', JSON.stringify(new Date().getTime()));

  const res = await axios({
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    url: 'https://imgbb.com/json',
    method: 'POST',
    data: dataRequest,
  });
  return res.data.image.display_url;
};

const plugins = createMyPlugins(
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
    createLinkPlugin(),
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
    components,
  }
);

interface IProps {
  id?: any;
  onChange?: any;
  value?: any;
  hideToolBar?: boolean;
  readOnly?: boolean;
  editableProps?: any;
}

const CustomPlate = (props: IProps) => {
  const containerRef = useRef(null);

  return (
    <DndProvider backend={HTML5Backend}>
      {!props.hideToolBar && (
        <PlateEventProvider>
          <HeadingToolbar>
            <ToolbarButtons />
          </HeadingToolbar>
        </PlateEventProvider>
      )}

      <div
        ref={containerRef}
        style={{ position: 'relative' }}
        className="CustomPlate"
      >
        <Plate<MyValue>
          editableProps={CONFIG.editableProps}
          // initialValue={VALUES.playground}
          plugins={plugins}
          readOnly
          {...props}
        >
          <MarkBallonToolbar />

          <MentionCombobox items={MENTIONABLES} />

          <CursorOverlayContainer containerRef={containerRef} />
        </Plate>
      </div>
    </DndProvider>
  );
};

export default CustomPlate;
