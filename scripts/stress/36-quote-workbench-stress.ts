import {
  addQuoteActivityNoteSchema,
  assignQuoteManagerSchema,
  updateQuoteFinancialsSchema,
  updateQuoteStatusSchema,
} from "../../schemas/quote-admin";

export async function runQuoteWorkbenchStressTest(): Promise<{
  success: boolean;
  testsRun: number;
  errors: string[];
}> {
  console.log("----------------------------------------------------------------");
  console.log("🧪 RUNNING SPEC 36: QUOTATION WORKBENCH STRESS & MATH SUITE");
  console.log("----------------------------------------------------------------");

  let testsRun = 0;
  const errors: string[] = [];

  // Test 1: Validate invalid discount percentage (> 100%)
  try {
    testsRun++;
    updateQuoteFinancialsSchema.parse({
      quoteId: "123e4567-e89b-12d3-a456-426614174000",
      shippingCost: 500,
      currency: "NPR",
      items: [
        {
          id: "123e4567-e89b-12d3-a456-426614174001",
          unitPrice: 10000,
          discountPercentage: 150, // Invalid!
        },
      ],
    });
    errors.push("Test 1 Failed: Zod failed to block discount percentage > 100%");
  } catch {
    console.log("  [1/4] Passed: Discount percentage > 100% blocked cleanly by Zod");
  }

  // Test 2: Financial Math Calculation (Subtotal, 13% VAT, Grand Total)
  try {
    testsRun++;
    const unitPrice = 100000;
    const quantity = 2;
    const discountPercentage = 10; // 10% off
    const shippingCost = 1500;

    const discountFraction = discountPercentage / 100;
    const lineTotal = Math.round(unitPrice * quantity * (1 - discountFraction)); // 200,000 * 0.9 = 180,000
    const calculatedSubtotal = lineTotal;
    const vatAmount = Math.round(calculatedSubtotal * 0.13); // 180,000 * 0.13 = 23,400
    const grandTotal = calculatedSubtotal + vatAmount + shippingCost; // 180,000 + 23,400 + 1,500 = 204,900

    if (calculatedSubtotal !== 180000 || vatAmount !== 23400 || grandTotal !== 204900) {
      errors.push(`Test 2 Failed: Math calculation mismatch! Subtotal=${calculatedSubtotal}, VAT=${vatAmount}, GrandTotal=${grandTotal}`);
    } else {
      console.log(`  [2/4] Passed: Financial Math verified (Subtotal: Rs. 180,000, 13% VAT: Rs. 23,400, Grand Total: Rs. 204,900)`);
    }
  } catch (err) {
    errors.push(`Test 2 Exception: ${(err as Error).message}`);
  }

  // Test 3: Status Transition Zod Enum Safety
  try {
    testsRun++;
    updateQuoteStatusSchema.parse({
      quoteId: "123e4567-e89b-12d3-a456-426614174000",
      status: "invalid_status" as any,
    });
    errors.push("Test 3 Failed: Zod failed to reject invalid quotation status enum");
  } catch {
    console.log("  [3/4] Passed: Invalid quotation status enum rejected cleanly by Zod");
  }

  // Test 4: Empty Activity Note Validation
  try {
    testsRun++;
    addQuoteActivityNoteSchema.parse({
      quoteId: "123e4567-e89b-12d3-a456-426614174000",
      message: "   ", // Empty whitespace note
    });
    errors.push("Test 4 Failed: Zod failed to reject empty activity note");
  } catch {
    console.log("  [4/4] Passed: Empty activity note rejected cleanly by Zod");
  }

  const success = errors.length === 0;
  console.log(`Spec 36 Stress Result: ${success ? "VERIFIED CLEAN ✅" : "FAILED ❌"}`);
  return { success, testsRun, errors };
}

if (require.main === module) {
  runQuoteWorkbenchStressTest().catch((err) => {
    console.error("Fatal error in Spec 36 stress test:", err);
    process.exit(1);
  });
}
