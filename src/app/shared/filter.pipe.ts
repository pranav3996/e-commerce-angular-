// filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  /**
   * Transform function to filter an array based on a given filter string and property name.
   *
   * @param value - The array to filter.
   * @param filterString - The string to use for filtering.
   * @param propName - The name of the property to filter against.
   * @returns The filtered array based on the provided filter string and property name.
   */
  transform(value: any[], filterString: string, propName: string): any[] {
    // Result array to store filtered items
    const result: any[] = [];

    // Check for null or empty values, and return the original array
    if (!value || filterString === '' || propName === '') {
      return value;
    }

    // Iterate through the array and filter based on the provided criteria
    value.forEach((item: any) => {
      // Convert both the property value and filter string to lowercase for case-insensitive comparison
      if (item[propName].trim().toLowerCase().includes(filterString.toLowerCase())) {
        // Add the item to the result array if it matches the filter criteria
        result.push(item);
      }
    });

    // Return the filtered result array
    return result;
  }
}
