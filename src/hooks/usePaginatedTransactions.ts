import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): PaginatedTransactionsResult {
	const { fetchWithCache, loading } = useCustomFetch()
	const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
		Transaction[]
	> | null>(null)

	const fetchAll = useCallback(async () => {
		const page = paginatedTransactions ? paginatedTransactions.nextPage : 0;

		if (paginatedTransactions?.nextPage === null) {
			return;
		}

		const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
			"paginatedTransactions",
			{
				page
			}
		)

			setPaginatedTransactions((previousResponse) => {

			if (response === null || previousResponse === null) {
				return response
			}

			return previousResponse ? { data: [...previousResponse.data, ...response.data], nextPage: response.nextPage } : response;
		})
	}, [fetchWithCache, paginatedTransactions])

	const invalidateData = useCallback(() => {
		setPaginatedTransactions(null)
	}, [])

	return { data: paginatedTransactions, loading, fetchAll, invalidateData }
}
