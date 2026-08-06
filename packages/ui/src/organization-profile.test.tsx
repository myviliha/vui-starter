import { type ReactElement } from "react";
import { describe, expect, it } from "vitest";

import {
  organizationProfileFields,
  orgProfileFields,
  type BrandAssetProps,
  type OrgProfile,
} from "./organization-profile";

/** The props the field handed to `BrandAsset`, without rendering it. */
const editProps = (fields: typeof organizationProfileFields, key: string) => {
  const field = fields.find((f) => f.key === key);
  const el = field?.renderInput?.({
    value: "logo.png",
    onChange: () => {},
    row: {} as OrgProfile,
    field,
    mode: "edit",
  } as never) as ReactElement<BrandAssetProps>;
  return el.props;
};

describe("orgProfileFields", () => {
  it("defaults the brand assets to inline (demo) mode with their size limits", () => {
    expect(editProps(organizationProfileFields, "logo")).toMatchObject({
      inline: true,
      maxBytes: 2 * 1024 * 1024,
      value: "logo.png",
    });
    expect(editProps(organizationProfileFields, "favicon")).toMatchObject({
      inline: true,
      maxBytes: 512 * 1024,
      square: true,
    });
  });

  it("wires the host's uploader in and drops inline mode", () => {
    const onPick = async () => ({ url: "https://cdn/logo.png" });
    const fields = orgProfileFields({ logo: { onPick, inline: false } });

    const logo = editProps(fields, "logo");
    expect(logo.onPick).toBe(onPick);
    expect(logo.inline).toBe(false);
    expect(logo.maxBytes).toBe(2 * 1024 * 1024); // preset default kept
    // Untouched fields keep the preset's defaults and order.
    expect(editProps(fields, "favicon").inline).toBe(true);
    expect(fields.map((f) => f.key)).toEqual(
      organizationProfileFields.map((f) => f.key),
    );
  });
});
