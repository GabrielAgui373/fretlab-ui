import { useEffect, useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Button } from "../Button";
import { Toast } from "./Toast";

type ToastStoryArgs = ComponentProps<typeof Toast>;

async function expectToastOpen(toast: HTMLElement) {
  await waitFor(() => {
    expect(toast).toHaveAttribute("data-state", "open");
    expect(Number(window.getComputedStyle(toast).opacity)).toBeGreaterThan(0.9);
  });
  await expect(toast).toBeVisible();
}

function ToastPreview(args: ToastStoryArgs) {
  const [isOpen, setIsOpen] = useState(args.isOpen);

  useEffect(() => {
    setIsOpen(args.isOpen);
  }, [args.isOpen]);

  return (
    <div style={{ minHeight: 220, display: "grid", placeItems: "center" }}>
      <Button onClick={() => setIsOpen(true)}>Mostrar toast</Button>
      <Toast
        {...args}
        isOpen={isOpen}
        onClose={() => {
          args.onClose?.();
          setIsOpen(false);
        }}
      />
    </div>
  );
}

const meta = {
  component: Toast,
  tags: ["ai-generated"],
  args: {
    autoCloseDelay: undefined,
    children: "As alteracoes foram salvas com sucesso.",
    closable: true,
    isOpen: true,
    layout: "complete",
    placement: "bottom-right",
    title: "Sessao atualizada",
    variant: "default",
  },
  argTypes: {
    autoCloseDelay: {
      control: "number",
    },
    children: {
      control: "text",
    },
    className: {
      control: false,
      table: { disable: true },
    },
    closable: {
      control: "inline-radio",
      options: [false, true],
    },
    icon: {
      control: false,
      table: { disable: true },
    },
    isOpen: {
      control: "inline-radio",
      options: [false, true],
    },
    layout: {
      control: "inline-radio",
      options: ["compact", "complete"],
    },
    onClose: {
      control: false,
      table: { disable: true },
    },
    placement: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
    },
    title: {
      control: "text",
    },
    variant: {
      control: "inline-radio",
      options: ["default", "success", "danger"],
    },
  },
  render: (args) => <ToastPreview {...args} />,
} satisfies Meta<ToastStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Complete: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    const toast = await body.findByRole("status");
    await expectToastOpen(toast);
    await userEvent.click(body.getByRole("button", { name: /fechar aviso/i }));
    await waitFor(() => {
      expect(toast).toHaveAttribute("data-state", "closed");
      const transform = window.getComputedStyle(toast).transform;
      const transformParts = transform.split(", ");
      const y =
        transform === "none"
          ? 0
          : Number(transformParts[transformParts.length - 1]?.replace(")", ""));
      expect(y).toBeLessThanOrEqual(0);
    });
    await waitFor(() => expect(body.queryByRole("status")).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole("button", { name: /mostrar toast/i }));
    await expectToastOpen(await body.findByRole("status"));
  },
};

export const Compact: Story = {
  args: {
    children: undefined,
    layout: "compact",
    placement: "top-center",
    title: "Sessao atualizada",
    variant: "success",
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const toast = await body.findByRole("status");
    await expectToastOpen(toast);
    await expect(toast).toHaveClass(/ui-toast--compact/);
  },
};

export const Success: Story = {
  args: {
    children: "Sua sessao ja esta disponivel na biblioteca.",
    layout: "complete",
    placement: "top-right",
    title: "Salvo",
    variant: "success",
  },
};

export const Danger: Story = {
  args: {
    children: "Nao foi possivel completar a acao. Tente novamente.",
    layout: "complete",
    placement: "bottom-left",
    title: "Erro ao salvar",
    variant: "danger",
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const toast = await body.findByRole("alert");
    await expectToastOpen(toast);
  },
};

export const WithoutCloseButton: Story = {
  args: {
    children: "O toast pode aparecer sem acao de fechamento.",
    closable: false,
    layout: "complete",
    title: "",
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expectToastOpen(body.getByRole("status"));
    await expect(body.queryByRole("button", { name: /fechar aviso/i })).not.toBeInTheDocument();
  },
};

export const Placements: Story = {
  render: () => (
    <>
      {([
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ] as const).map((placement) => (
        <Toast key={placement} isOpen layout="compact" placement={placement} variant="success">
          {placement}
        </Toast>
      ))}
    </>
  ),
  play: async ({ canvasElement }) => {
    const viewport = canvasElement.ownerDocument.documentElement;
    const body = within(canvasElement.ownerDocument.body);
    const toasts = await body.findAllByRole("status");

    await waitFor(() => {
      for (const toast of toasts) {
        expect(toast).toHaveAttribute("data-state", "open");
        expect(Number(window.getComputedStyle(toast).opacity)).toBeGreaterThan(0.9);
        const rect = toast.getBoundingClientRect();
        expect(rect.left).toBeGreaterThanOrEqual(11);
        expect(rect.top).toBeGreaterThanOrEqual(11);
        expect(rect.right).toBeLessThanOrEqual(viewport.clientWidth - 11);
        expect(rect.bottom).toBeLessThanOrEqual(viewport.clientHeight - 11);
      }
    });
  },
};
