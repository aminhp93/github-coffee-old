import { CodeAlt } from '@styled-icons/boxicons-regular/CodeAlt';
import { CodeBlock } from '@styled-icons/boxicons-regular/CodeBlock';
import { Highlight } from '@styled-icons/boxicons-regular/Highlight';
import { BorderAll } from '@styled-icons/material/BorderAll';
import { Check } from '@styled-icons/material/Check';
import { FontDownload } from '@styled-icons/material/FontDownload';
import { FormatAlignCenter } from '@styled-icons/material/FormatAlignCenter';
import { FormatAlignJustify } from '@styled-icons/material/FormatAlignJustify';
import { FormatAlignLeft } from '@styled-icons/material/FormatAlignLeft';
import { FormatAlignRight } from '@styled-icons/material/FormatAlignRight';
import { FormatBold } from '@styled-icons/material/FormatBold';
import { FormatColorText } from '@styled-icons/material/FormatColorText';
import { FormatIndentDecrease } from '@styled-icons/material/FormatIndentDecrease';
import { FormatIndentIncrease } from '@styled-icons/material/FormatIndentIncrease';
import { FormatItalic } from '@styled-icons/material/FormatItalic';
import { FormatListBulleted } from '@styled-icons/material/FormatListBulleted';
import { FormatListNumbered } from '@styled-icons/material/FormatListNumbered';
import { FormatQuote } from '@styled-icons/material/FormatQuote';
import { FormatStrikethrough } from '@styled-icons/material/FormatStrikethrough';
import { FormatUnderlined } from '@styled-icons/material/FormatUnderlined';
import { Image } from '@styled-icons/material/Image';
import { Keyboard } from '@styled-icons/material/Keyboard';
import { Link } from '@styled-icons/material/Link';
import { OndemandVideo } from '@styled-icons/material/OndemandVideo';
import {
  AlignToolbarButton,
  BalloonToolbar,
  BlockToolbarButton,
  CodeBlockToolbarButton,
  ColorPickerToolbarDropdown,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_OL,
  ELEMENT_UL,
  getPluginType,
  ImageToolbarButton,
  indent,
  insertTable,
  LinkToolbarButton,
  ListToolbarButton,
  MarkToolbarButton,
  MARK_BG_COLOR,
  MARK_BOLD,
  MARK_CODE,
  MARK_COLOR,
  MARK_HIGHLIGHT,
  MARK_ITALIC,
  MARK_KBD,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
  MediaEmbedToolbarButton,
  outdent,
  TableToolbarButton,
  ToolbarButton,
} from '@udecode/plate';
import 'tippy.js/animations/scale.css';
import 'tippy.js/dist/tippy.css';
import { useMyPlateEditorRef } from '../typescript';

export const BasicElementToolbarButtons = () => {
  const editor = useMyPlateEditorRef()!;

  return (
    <>
      {/* <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H1)}
        icon={<LooksOne />}
      /> */}
      {/* <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H2)}
        icon={<LooksTwo />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H3)}
        icon={<Looks3 />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H4)}
        icon={<Looks4 />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H5)}
        icon={<Looks5 />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H6)}
        icon={<Looks6 />}
      /> */}
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<FormatQuote />}
      />
      <CodeBlockToolbarButton
        type={getPluginType(editor, ELEMENT_CODE_BLOCK)}
        icon={<CodeBlock />}
      />
    </>
  );
};

export const IndentToolbarButtons = () => {
  const editor = useMyPlateEditorRef()!;

  return (
    <>
      <ToolbarButton
        onMouseDown={(e) => {
          if (!editor) return;

          outdent(editor);
          e.preventDefault();
        }}
        icon={<FormatIndentDecrease />}
      />
      <ToolbarButton
        onMouseDown={(e) => {
          if (!editor) return;

          indent(editor);
          e.preventDefault();
        }}
        icon={<FormatIndentIncrease />}
      />
    </>
  );
};

export const ListToolbarButtons = () => {
  const editor = useMyPlateEditorRef()!;

  return (
    <>
      <ListToolbarButton
        type={getPluginType(editor, ELEMENT_UL)}
        icon={<FormatListBulleted />}
      />
      <ListToolbarButton
        type={getPluginType(editor, ELEMENT_OL)}
        icon={<FormatListNumbered />}
      />
    </>
  );
};

export const AlignToolbarButtons = () => {
  return (
    <>
      <AlignToolbarButton value="left" icon={<FormatAlignLeft />} />
      <AlignToolbarButton value="center" icon={<FormatAlignCenter />} />
      <AlignToolbarButton value="right" icon={<FormatAlignRight />} />
      <AlignToolbarButton value="justify" icon={<FormatAlignJustify />} />
    </>
  );
};

export const BasicMarkToolbarButtons = () => {
  const editor = useMyPlateEditorRef()!;

  return (
    <>
      <MarkToolbarButton
        type={getPluginType(editor, MARK_BOLD)}
        icon={<FormatBold />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_ITALIC)}
        icon={<FormatItalic />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_UNDERLINE)}
        icon={<FormatUnderlined />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_STRIKETHROUGH)}
        icon={<FormatStrikethrough />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_CODE)}
        icon={<CodeAlt />}
      />
      {/* <MarkToolbarButton
        type={getPluginType(editor, MARK_SUPERSCRIPT)}
        clear={getPluginType(editor, MARK_SUBSCRIPT)}
        icon={<Superscript />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_SUBSCRIPT)}
        clear={getPluginType(editor, MARK_SUPERSCRIPT)}
        icon={<Subscript />}
      /> */}
    </>
  );
};

export const KbdToolbarButton = () => {
  const editor = useMyPlateEditorRef()!;

  return (
    <MarkToolbarButton
      type={getPluginType(editor, MARK_KBD)}
      icon={<Keyboard />}
    />
  );
};

export const HighlightToolbarButton = () => {
  const editor = useMyPlateEditorRef()!;

  return (
    <MarkToolbarButton
      type={getPluginType(editor, MARK_HIGHLIGHT)}
      icon={<Highlight />}
    />
  );
};

export const TableToolbarButtons = () => (
  <>
    <TableToolbarButton icon={<BorderAll />} transform={insertTable} />
    {/* <TableToolbarButton icon={<BorderClear />} transform={deleteTable} />
    <TableToolbarButton icon={<BorderBottom />} transform={addRow} />
    <TableToolbarButton icon={<BorderTop />} transform={deleteRow} />
    <TableToolbarButton icon={<BorderLeft />} transform={addColumn} />
    <TableToolbarButton icon={<BorderRight />} transform={deleteColumn} /> */}
  </>
);

export const MarkBallonToolbar = () => {
  // const editor = useMyPlateEditorRef()!;

  const arrow = false;
  const theme = 'dark';
  // const tooltip: TippyProps = {
  //   arrow: true,
  //   delay: 0,
  //   duration: [200, 0],
  //   hideOnClick: false,
  //   offset: [0, 17],
  //   placement: 'top',
  // };

  return (
    <BalloonToolbar
      // popperOptions={{
      //   placement: 'top',
      // }}
      theme={theme}
      arrow={arrow}
    >
      {/* <MarkToolbarButton
        type={getPluginType(editor, MARK_BOLD)}
        icon={<FormatBold />}
        tooltip={{ content: 'Bold (⌘B)', ...tooltip }}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_ITALIC)}
        icon={<FormatItalic />}
        tooltip={{ content: 'Italic (⌘I)', ...tooltip }}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_UNDERLINE)}
        icon={<FormatUnderlined />}
        tooltip={{ content: 'Underline (⌘U)', ...tooltip }}
      /> */}
      <ToolbarButtons />
    </BalloonToolbar>
  );
};

export const ToolbarButtons = () => (
  <>
    <BasicElementToolbarButtons />
    <ListToolbarButtons />
    <IndentToolbarButtons />
    <BasicMarkToolbarButtons />
    <ColorPickerToolbarDropdown
      pluginKey={MARK_COLOR}
      icon={<FormatColorText />}
      selectedIcon={<Check />}
      tooltip={{ content: 'Text color' }}
    />
    <ColorPickerToolbarDropdown
      pluginKey={MARK_BG_COLOR}
      icon={<FontDownload />}
      selectedIcon={<Check />}
      tooltip={{ content: 'Highlight color' }}
    />
    <AlignToolbarButtons />
    <LinkToolbarButton icon={<Link />} />
    <ImageToolbarButton icon={<Image />} />
    <MediaEmbedToolbarButton icon={<OndemandVideo />} />
    <TableToolbarButtons />
  </>
);
