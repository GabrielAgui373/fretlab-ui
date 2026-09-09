import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import { Modal, ModalFooter, ModalHeader } from "./Modal";

const meta = {
  component: Modal,
  tags: ["ai-generated"],
  args: {
    closeOnBackdrop: true,
    isOpen: true,
    placement: "center",
    showCloseButton: true,
    size: "md",
    subtitle: "Novo espaco",
    title: "O que vamos praticar?",
  },
  argTypes: {
    "aria-label": {
      control: "text",
    },
    "aria-labelledby": {
      control: false,
      table: { disable: true },
    },
    body: {
      control: false,
      table: { disable: true },
    },
    bodyClassName: {
      control: false,
      table: { disable: true },
    },
    children: {
      control: false,
      table: { disable: true },
    },
    className: {
      control: false,
      table: { disable: true },
    },
    closeOnBackdrop: {
      control: "inline-radio",
      options: [false, true],
    },
    customFooter: {
      control: false,
      table: { disable: true },
    },
    footer: {
      control: false,
      table: { disable: true },
    },
    footerClassName: {
      control: false,
      table: { disable: true },
    },
    header: {
      control: false,
      table: { disable: true },
    },
    headerClassName: {
      control: false,
      table: { disable: true },
    },
    isOpen: {
      control: "inline-radio",
      options: [false, true],
    },
    onClose: {
      control: false,
      table: { disable: true },
    },
    placement: {
      control: "inline-radio",
      options: ["center", "right"],
    },
    showCloseButton: {
      control: "inline-radio",
      options: [false, true],
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
    subtitle: {
      control: "text",
    },
    title: {
      control: "text",
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

async function expectVisible(element: HTMLElement) {
  await waitFor(() => expect(element).toBeVisible());
}

const defaultBody = (
  <p style={{ margin: 0, color: "var(--color-text-muted)", lineHeight: 1.6 }}>
    De um nome claro. Voce podera organizar o conteudo depois.
  </p>
);

const defaultFooter = (
  <>
    <Button variant="ghost">Cancelar</Button>
    <Button>Criar sessao</Button>
  </>
);

export const Complete: Story = {
  args: {
    children: defaultBody,
    footer: defaultFooter,
    onClose: () => undefined,
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expectVisible(body.getByRole("dialog", { name: /o que vamos praticar/i }));
    await expectVisible(body.getByRole("button", { name: /criar sessao/i }));
  },
};

export const WithoutFooter: Story = {
  args: {
    children: defaultBody,
    onClose: () => undefined,
    title: "Modal sem footer",
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole("dialog", { name: /modal sem footer/i });
    await expect(dialog.querySelector(".ui-modal__footer")).not.toBeInTheDocument();
  },
};

export const WithoutBody: Story = {
  args: {
    footer: defaultFooter,
    onClose: () => undefined,
    subtitle: "Apenas cabecalho e acoes",
    title: "Modal sem body",
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole("dialog", { name: /modal sem body/i });
    await expect(dialog.querySelector(".ui-modal__content")).not.toBeInTheDocument();
    await expectVisible(body.getByRole("button", { name: /criar sessao/i }));
  },
};

export const CustomHeader: Story = {
  render: (args) => {
    const titleId = "modal-custom-header-title";

    return (
      <Modal
        {...args}
        aria-labelledby={titleId}
        header={
          <ModalHeader>
            <div>
              <span className="ui-modal__subtitle">Biblioteca</span>
              <h2 id={titleId}>Header customizado</h2>
              <p style={{ margin: "8px 0 0", color: "var(--color-text-muted)", fontSize: 12 }}>
                Um header pode trazer informacoes extras mantendo a estrutura do modal.
              </p>
            </div>
            <IconButton
              aria-label="Fechar"
              icon={<Icon name="close" size={19} decorative />}
              onClick={args.onClose}
            />
          </ModalHeader>
        }
      >
        {defaultBody}
      </Modal>
    );
  },
  args: {
    onClose: () => undefined,
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expectVisible(await body.findByRole("dialog", { name: /header customizado/i }));
  },
};

export const CustomFooter: Story = {
  args: {
    children: defaultBody,
    customFooter: (
      <ModalFooter style={{ justifyContent: "space-between" }}>
        <Button icon={<Icon name="trash" size={17} decorative />} variant="ghost">
          Excluir
        </Button>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="ghost">Cancelar</Button>
          <Button icon={<Icon name="save" size={17} decorative />}>Salvar</Button>
        </div>
      </ModalFooter>
    ),
    onClose: () => undefined,
    title: "Footer customizado",
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expectVisible(await body.findByRole("button", { name: /excluir/i }));
    await expectVisible(body.getByRole("button", { name: /salvar/i }));
  },
};

export const Drawer: Story = {
  args: {
    children: (
      <p style={{ margin: 0, color: "var(--color-text-muted)", lineHeight: 1.6 }}>
        Mantenha o contexto da sessao facil de encontrar.
      </p>
    ),
    onClose: () => undefined,
    placement: "right",
    subtitle: "Detalhes da sessao",
    title: "Improviso em Do menor",
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Abrir modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p style={{ margin: 0, color: "var(--color-text-muted)", lineHeight: 1.6 }}>
            Este exemplo usa o mesmo portal em document.body que o app.
          </p>
        </Modal>
      </>
    );
  },
  args: {
    children: null,
    onClose: () => undefined,
    title: "Modal controlado",
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /abrir modal/i }));
    const body = within(canvasElement.ownerDocument.body);
    await expectVisible(body.getByRole("dialog", { name: /modal controlado/i }));
  },
};
