import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import { TextInput } from "./TextInput";
import "./TextInput.stories.css";

const meta = {
  component: TextInput,
  parameters: {
    layout: "padded",
  },
  tags: ["ai-generated"],
  args: {
    disabled: false,
    label: "Nome",
    optional: false,
    placeholder: "Ex.: Improviso em Do menor",
    readOnly: false,
    required: false,
    showCount: false,
    size: "md",
  },
  argTypes: {
    action: {
      control: false,
      table: { disable: true },
    },
    className: {
      control: false,
      table: { disable: true },
    },
    containerClassName: {
      control: false,
      table: { disable: true },
    },
    disabled: {
      control: "inline-radio",
      options: [false, true],
    },
    leadingIcon: {
      control: false,
    },
    multiline: {
      control: false,
      table: { disable: true },
    },
    onChange: {
      control: false,
      table: { disable: true },
    },
    optional: {
      control: "inline-radio",
      options: [false, true],
    },
    readOnly: {
      control: "inline-radio",
      options: [false, true],
    },
    required: {
      control: "inline-radio",
      options: [false, true],
    },
    showCount: {
      control: "inline-radio",
      options: [false, true],
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
    trailingIcon: {
      control: false,
    },
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ label, placeholder, size }) => {
    const [value, setValue] = useState("");

    return (
      <div className="text-input-story">
        <TextInput
          label={label}
          onChange={(event) => setValue(event.currentTarget.value)}
          placeholder={placeholder}
          size={size}
          value={value}
        />
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText("Nome"), "Pentatonica");
    await expect(canvas.getByDisplayValue("Pentatonica")).toBeVisible();
  },
};

export const SearchWithAction: Story = {
  render: () => {
    const [value, setValue] = useState("Pentatonica");

    return (
      <div className="text-input-story">
        <TextInput
          action={
            <IconButton
              aria-label="Limpar busca"
              icon={<Icon name="close" size={16} decorative />}
              onClick={() => setValue("")}
              variant="ghost"
            />
          }
          aria-label="Buscar sessoes"
          leadingIcon={<Icon name="search" size={18} decorative />}
          onChange={(event) => setValue(event.currentTarget.value)}
          placeholder="Buscar sessao..."
          type="search"
          value={value}
        />
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Limpar busca" }));
    await expect(canvas.getByLabelText("Buscar sessoes")).toHaveValue("");
  },
};

export const PasswordWithAction: Story = {
  render: () => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="text-input-story">
        <TextInput
          action={
            <IconButton
              aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
              icon={<Icon name={visible ? "eyeOff" : "eye"} size={17} decorative />}
              onClick={() => setVisible((current) => !current)}
              variant="ghost"
            />
          }
          label="Senha"
          leadingIcon={<Icon name="lock" size={18} decorative />}
          placeholder="Digite sua senha"
          type={visible ? "text" : "password"}
        />
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Senha");
    await expect(input).toHaveAttribute("type", "password");
    await userEvent.click(canvas.getByRole("button", { name: "Mostrar senha" }));
    await expect(input).toHaveAttribute("type", "text");
  },
};

export const ActionLoading: Story = {
  render: () => (
    <div className="text-input-story">
      <TextInput
        action={
          <IconButton
            aria-label="Verificando link"
            icon={<Icon name="arrow" size={16} decorative />}
            isLoading
            variant="ghost"
          />
        }
        defaultValue="https://fretlab.app/session"
        label="Link compartilhavel"
        leadingIcon={<Icon name="link" size={18} decorative />}
        readOnly
        type="url"
      />
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    label: "Email",
    leadingIcon: <Icon name="mail" size={18} decorative />,
    placeholder: "voce@email.com",
    trailingIcon: <Icon name="check" size={17} decorative />,
    type: "email",
  },
  render: (args) => (
    <div className="text-input-story">
      <TextInput {...args} />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="text-input-story-stack">
      <TextInput label="Pequeno" placeholder="Campo compacto" size="sm" />
      <TextInput label="Medio" placeholder="Campo padrao" size="md" />
      <TextInput label="Grande" placeholder="Campo de destaque" size="lg" />
    </div>
  ),
};

export const ValidationStates: Story = {
  render: () => (
    <div className="text-input-story-stack">
      <TextInput
        error="O email informado nao e valido."
        label="Com erro"
        leadingIcon={<Icon name="warning" size={18} decorative />}
        value="nome@"
        readOnly
      />
      <TextInput
        label="Validado"
        success="Disponivel para uso."
        trailingIcon={<Icon name="check" size={17} decorative />}
        value="gabriel"
        readOnly
      />
      <TextInput
        hint="Use um nome curto e facil de reconhecer."
        label="Com ajuda"
        placeholder="Nome da sessao"
      />
    </div>
  ),
};

export const RequiredAndOptional: Story = {
  render: () => (
    <div className="text-input-story-stack">
      <TextInput label="Nome" placeholder="Campo obrigatorio" required />
      <TextInput label="Apelido" optional placeholder="Campo opcional" />
    </div>
  ),
};

export const DisabledAndReadOnly: Story = {
  render: () => (
    <div className="text-input-story-stack">
      <TextInput
        disabled
        label="Desabilitado"
        leadingIcon={<Icon name="lock" size={18} decorative />}
        value="Campo indisponivel"
        readOnly
      />
      <TextInput
        action={
          <IconButton
            aria-label="Copiar identificador"
            icon={<Icon name="copy" size={16} decorative />}
            variant="ghost"
          />
        }
        label="Somente leitura"
        value="session-7f12a"
        readOnly
      />
    </div>
  ),
};

export const CharacterCount: Story = {
  render: () => (
    <div className="text-input-story">
      <TextInput
        defaultValue="Solo"
        label="Titulo"
        maxLength={24}
        showCount
      />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText("Titulo"), " final");
    await expect(canvas.getByText("10/24")).toBeVisible();
  },
};

export const Multiline: Story = {
  render: () => (
    <div className="text-input-story">
      <TextInput
        defaultValue="Treinar entrada do solo e repetir o trecho final."
        hint="Registre objetivos, repertorio ou lembretes."
        label="Descricao"
        maxLength={2000}
        multiline
        optional
        rows={4}
        showCount
      />
    </div>
  ),
};
