<script setup lang="ts">
import { watch } from 'vue'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import { transactionSchema } from '@/features/transactions/schemas/transactionSchema'
import type { Transaction, TransactionType } from '@/features/transactions/types/transaction.types'

const props = withDefaults(
  defineProps<{
    transaction?: Transaction | null
  }>(),
  {
    transaction: null,
  },
)

const emit = defineEmits<{
  submit: [transaction: Transaction]
  update: [transaction: Transaction]
  cancel: []
}>()

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: toTypedSchema(transactionSchema),
})

const { value: typeValue, errorMessage: typeError } = useField<TransactionType>('type', undefined, {
  initialValue: 'expense',
})
const { value: amountValue, errorMessage: amountError } = useField<number | ''>(
  'amount',
  undefined,
  { initialValue: '' },
)
const { value: categoryValue, errorMessage: categoryError } = useField<string>(
  'category',
  undefined,
  { initialValue: '' },
)
const { value: dateValue, errorMessage: dateError } = useField<string>('date', undefined, {
  initialValue: '',
})
const { value: noteValue, errorMessage: noteError } = useField<string>('note', undefined, {
  initialValue: '',
})

watch(
  () => props.transaction,
  (transaction) => {
    if (transaction) {
      setValues({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
        note: transaction.note ?? '',
      })
      return
    }
    resetForm()
  },
  { immediate: true },
)

const fieldClass =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'

const onSubmit = handleSubmit((values) => {
  if (props.transaction) {
    emit('update', { ...props.transaction, ...values })
    return
  }

  emit('submit', { id: Date.now(), ...values })
  resetForm()
})
</script>

<template>
  <section>
    <h2 class="text-xl font-semibold text-slate-900">
      {{ transaction ? 'Edit Transaction' : 'Add Transaction' }}
    </h2>

    <form
      class="mt-4 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      novalidate
      @submit.prevent="onSubmit"
    >
      <fieldset>
        <legend class="text-sm font-medium text-slate-700">Type</legend>
        <div class="mt-2 flex gap-4">
          <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              v-model="typeValue"
              type="radio"
              value="income"
              class="h-4 w-4 accent-indigo-600"
            />
            Income
          </label>
          <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              v-model="typeValue"
              type="radio"
              value="expense"
              class="h-4 w-4 accent-indigo-600"
            />
            Expense
          </label>
        </div>
        <p v-if="typeError" class="mt-2 text-sm text-rose-600">{{ typeError }}</p>
      </fieldset>

      <div>
        <label for="amount" class="block text-sm font-medium text-slate-700">Amount</label>
        <input
          id="amount"
          v-model.number="amountValue"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          required
          :class="fieldClass"
        />
        <p v-if="amountError" class="mt-1 text-sm text-rose-600">{{ amountError }}</p>
      </div>

      <div>
        <label for="category" class="block text-sm font-medium text-slate-700">Category</label>
        <input
          id="category"
          v-model="categoryValue"
          type="text"
          placeholder="e.g. Groceries"
          required
          :class="fieldClass"
        />
        <p v-if="categoryError" class="mt-1 text-sm text-rose-600">{{ categoryError }}</p>
      </div>

      <div>
        <label for="date" class="block text-sm font-medium text-slate-700">Date</label>
        <input id="date" v-model="dateValue" type="date" required :class="fieldClass" />
        <p v-if="dateError" class="mt-1 text-sm text-rose-600">{{ dateError }}</p>
      </div>

      <div>
        <label for="note" class="block text-sm font-medium text-slate-700">Note</label>
        <textarea
          id="note"
          v-model="noteValue"
          rows="3"
          placeholder="Optional"
          :class="fieldClass"
        ></textarea>
        <p v-if="noteError" class="mt-1 text-sm text-rose-600">{{ noteError }}</p>
      </div>

      <div class="flex gap-3">
        <button
          type="submit"
          class="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {{ transaction ? 'Save Changes' : 'Add Transaction' }}
        </button>
        <button
          v-if="transaction"
          type="button"
          class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          @click="emit('cancel')"
        >
          Cancel
        </button>
      </div>
    </form>
  </section>
</template>
