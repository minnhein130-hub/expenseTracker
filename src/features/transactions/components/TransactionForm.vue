<script setup lang="ts">
import { computed, watch } from 'vue'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'

import { categoriesForType } from '@/features/transactions/utils/categories'
import { transactionSchema } from '@/features/transactions/schemas/transactionSchema'
import type { Transaction, TransactionType } from '@/features/transactions/types/transaction.types'

const props = withDefaults(
  defineProps<{
    transaction?: Transaction | null
    variant?: 'page' | 'modal'
  }>(),
  {
    transaction: null,
    variant: 'page',
  },
)

const emit = defineEmits<{
  submit: [transaction: Transaction]
  update: [transaction: Transaction]
  cancel: []
}>()

function getTodayLocalDate(): string {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

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
  initialValue: getTodayLocalDate(),
})
const { value: noteValue, errorMessage: noteError } = useField<string>('note', undefined, {
  initialValue: '',
})

const isModal = computed(() => props.variant === 'modal')
const categories = computed(() => {
  const list = categoriesForType(typeValue.value)
  const current = categoryValue.value
  return current && !list.includes(current) ? [current, ...list] : list
})

const formClass = computed(() =>
  isModal.value
    ? 'space-y-5'
    : 'mt-4 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm',
)

const fieldsLayoutClass = computed(() =>
  isModal.value ? 'grid gap-5 sm:grid-cols-2' : 'space-y-5',
)

const categoryFieldClass = computed(() => (isModal.value ? 'order-last sm:col-span-2' : undefined))

const buttonsClass = computed(() => (isModal.value ? 'flex justify-end gap-3' : 'flex gap-3'))

const submitButtonClass = computed(() => (isModal.value ? undefined : 'flex-1'))

const fieldClass =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'

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

watch(typeValue, () => {
  if (!isModal.value) {
    return
  }
  if (!categoriesForType(typeValue.value).includes(categoryValue.value)) {
    categoryValue.value = ''
  }
})

function typeButtonClass(selected: boolean) {
  return selected
    ? 'rounded-md bg-white px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm'
    : 'rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700'
}

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
    <h2 v-if="!isModal" class="text-xl font-semibold text-slate-900">
      {{ transaction ? 'Edit Transaction' : 'Add Transaction' }}
    </h2>

    <form :class="formClass" novalidate @submit.prevent="onSubmit">
      <fieldset>
        <legend class="text-sm font-medium text-slate-700">Type</legend>
        <div v-if="isModal" class="mt-2 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            :class="typeButtonClass(typeValue === 'expense')"
            @click="typeValue = 'expense'"
          >
            Expenses
          </button>
          <button
            type="button"
            :class="typeButtonClass(typeValue === 'income')"
            @click="typeValue = 'income'"
          >
            Income
          </button>
        </div>
        <div v-else class="mt-2 flex gap-4">
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

      <div :class="fieldsLayoutClass">
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

        <div :class="categoryFieldClass">
          <label for="category" class="block text-sm font-medium text-slate-700">Category</label>
          <select v-if="isModal" id="category" v-model="categoryValue" :class="fieldClass">
            <option value="" disabled>Select category</option>
            <option v-for="option in categories" :key="option" :value="option">{{ option }}</option>
          </select>
          <BaseInput
            v-else
            id="category"
            v-model="categoryValue"
            type="text"
            placeholder="e.g. Groceries"
            required
            class="mt-1"
          />
          <p v-if="categoryError" class="mt-1 text-sm text-rose-600">{{ categoryError }}</p>
        </div>

        <div>
          <label for="date" class="block text-sm font-medium text-slate-700">Date</label>
          <BaseInput id="date" v-model="dateValue" type="date" required class="mt-1" />
          <p v-if="dateError" class="mt-1 text-sm text-rose-600">{{ dateError }}</p>
        </div>
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
        <p v-if="noteError" class="mt-1 mb-6 text-sm text-rose-600">{{ noteError }}</p>
      </div>

      <div :class="buttonsClass">
        <BaseButton
          v-if="transaction || isModal"
          variant="secondary"
          @click="emit('cancel')"
        >
          Cancel
        </BaseButton>

        <BaseButton type="submit" :class="submitButtonClass">
          {{ isModal ? 'Save' : transaction ? 'Save Changes' : 'Add Transaction' }}
        </BaseButton>
      </div>
    </form>
  </section>
</template>
